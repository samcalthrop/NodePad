import { app, shell, BrowserWindow, ipcMain, IpcMainEvent, screen } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { TreeNodeData } from '@mantine/core';
import icon from '../../resources/icon.png?asset';
import { getTreeNodeData } from './getTreeNodeData';
import { dialog } from 'electron';
import { readFile } from 'fs/promises';
import {
  checkCredentials,
  createCredentials,
  updateEmail,
  updatePassword,
  getFileTags,
  saveFileTags,
  getGlobalTags,
} from './dbHandling';
import { getFileContents, saveFile, renameFile, getMimeType } from './fileHandling';

function createWindow(): void {
  // retrieve the dimensions of the user's primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // create the browser window
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
    // remove the default title bar
    titleBarStyle: 'hidden',
    // expose window controls in Windows/Linux
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// this method will be called when Electron has finished
// initialization and is ready to create browser windows
app.whenReady().then(() => {
  // set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // default open or close devtools with F12
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // when the frontend requests the file tree...
  ipcMain.on('get-tree-node-data', (event: IpcMainEvent, path: string) => {
    // all files/ directories found and returned to frontend
    const data: TreeNodeData[] = getTreeNodeData(path);
    event.sender.send('get-tree-node-data-success', data);
    console.log('tree node data successfully retrieved');
  });

  // when ipcMain receives request for file contents...
  ipcMain.on('get-file-contents', (event: IpcMainEvent, path: string) => {
    // file contents are read in and returned
    const fileContents: string = getFileContents(path);
    console.log('on get-file-contents: fileContents:', fileContents);
    event.sender.send('get-file-contents-success', fileContents);
  });

  // when passed new db credentials...
  ipcMain.on('create-credentials', async (event: IpcMainEvent, { email, password }) => {
    console.log('main:create-credentials', email, password);
    // new record is created, or error is returned
    const result = await createCredentials(email, password);
    result.success
      ? event.sender.send('create-credentials-success', result.success)
      : event.sender.send('create-credentials-failure', result.success);
  });

  // when passed existing db credentials...
  ipcMain.on('check-credentials', async (event: IpcMainEvent, { email, password }) => {
    console.log('main:check-credentials', email, password);
    // credentials are checked against existing records, true/ false returned
    const result = await checkCredentials(email, password);
    result.success
      ? event.sender.send('check-credentials-success', result.success)
      : event.sender.send('check-credentials-failure', result.success);
  });

  // new email is given...
  ipcMain.on('update-email', async (event: IpcMainEvent, { oldEmail, newEmail }) => {
    // old email is located and updated, or old email not found
    console.log('main:update-email', oldEmail, newEmail);
    const result = await updateEmail(oldEmail, newEmail);
    result.success
      ? event.sender.send('update-email-success', result.success)
      : event.sender.send('update-email-failure', result.success);
  });

  // new password is given...
  ipcMain.on('update-password', async (event: IpcMainEvent, { email, password }) => {
    // email is located and password updated, or email not found
    console.log('main:update-password', email, password);
    const result = await updatePassword(email, password);
    result.success
      ? event.sender.send('update-password-success', result.success)
      : event.sender.send('update-password-failure', result.success);
  });

  // when passed a file path and content...
  ipcMain.on('save-file', async (event: IpcMainEvent, { filePath, content }) => {
    console.log('main:save-file', filePath, content);
    // update the file contents, or filepath not found
    const result = await saveFile(filePath, content);
    result.success
      ? event.sender.send('save-file-success', result.success)
      : event.sender.send('save-file-failure', result.success);
  });

  // when passed file path and new title...
  ipcMain.on('rename-file', async (event: IpcMainEvent, { oldPath, newTitle }) => {
    // update title of file, or filepath not found
    console.log('main:rename-file', oldPath, newTitle);
    const result = await renameFile(oldPath, newTitle);
    result.success
      ? event.sender.send('rename-file-success', result)
      : event.sender.send('rename-file-failure', result);
  });

  // when passed a filepath...
  ipcMain.on('get-file-tags', async (event: IpcMainEvent, filePath) => {
    // return the tags attached to that file, or an empty array
    console.log('main:get-file-tags', filePath);
    const result = await getFileTags(filePath);
    console.log('file tags:', result);
    event.sender.send('get-file-tags-success', result);
  });

  // when passed a filepath and array of tags...
  ipcMain.on('save-file-tags', async (event: IpcMainEvent, { filePath, tags }) => {
    // update db to store all existing tags attached to the file
    console.log('main:save-file-tags', filePath, tags);
    const result = await saveFileTags(filePath, tags);
    result.success
      ? event.sender.send('save-file-tags-success', result)
      : event.sender.send('save-file-tags-failure', result);
  });

  // when passed the path to a directory...
  ipcMain.on('get-global-tags', async (event: IpcMainEvent, directoryPath) => {
    // return the tags attached to that file, or an empty array
    console.log('main:get-global-tags', directoryPath);
    const result = await getGlobalTags(directoryPath);
    console.log('global tags:', result);
    event.sender.send('get-global-tags-success', result);
  });

  createWindow();

  app.on('activate', function () {
    // common on macOS to re-create a window when the
    // dock icon clicked & no other windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// quit when all windows are closed unless OS=macOS
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  app.quit();
});

// listens for the request to select a directory, opens the native OS' filesystem UI and returns selected directory path
ipcMain.handle('open-directory-selector', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return result.filePaths[0];
});

// listens for the request to select a file, opens the native OS' filesystem UI and returns selected file path
ipcMain.handle('open-file-selector', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }],
  });

  if (result.filePaths.length > 0) {
    const imgPath = result.filePaths[0];
    const imgBuffer = await readFile(imgPath);
    const base64Img = imgBuffer.toString('base64');
    const mimeType = getMimeType(imgPath);
    return `data:${mimeType};base64,${base64Img}`;
  }
  return null;
});

// listens for the request to retrieve the path to the resources directory
ipcMain.handle('getResourcePath', () => {
  if (app.isPackaged) {
    console.log(path.join(process.resourcesPath, 'resources'));
    // if in production, files are located in different area to in development
    return path.join(process.resourcesPath, 'resources');
  } else {
    return path.join(app.getAppPath(), 'resources');
  }
});
