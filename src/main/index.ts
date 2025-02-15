import { app, shell, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { TreeNodeData } from '@mantine/core';
import icon from '../../resources/icon.png?asset';
import { getTreeNodeData } from './getTreeNodeData';
import { dialog } from 'electron';
import { readFile } from 'fs/promises';
import { checkCredentials, createCredentials } from './dbHandling';
import { getFileContents, saveFile, renameFile } from './fileHandling';

function createWindow(): void {
  // create the browser window
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools with F12
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

  // when ipc receives request for file contents...
  ipcMain.on('get-file-contents', (event: IpcMainEvent, path: string) => {
    // file contents are read in and returned
    const fileContents: string = getFileContents(path);
    console.log('on get-file-contents: fileContents:', fileContents);
    event.sender.send('get-file-contents-success', fileContents);
  });

  ipcMain.on('create-credentials', async (event: IpcMainEvent, { email, password }) => {
    console.log('main:create-credentials', email, password);
    const result = await createCredentials(email, password);
    result.success
      ? event.sender.send('create-credentials-success', result.success)
      : event.sender.send('create-credentials-failure', result.success);
  });

  ipcMain.on('check-credentials', async (event: IpcMainEvent, { email, password }) => {
    console.log('main:check-credentials', email, password);
    const result = await checkCredentials(email, password);
    result.success
      ? event.sender.send('check-credentials-success', result.success)
      : event.sender.send('check-credentials-failure', result.success);
  });

  ipcMain.on('save-file', async (event: IpcMainEvent, { filePath, content }) => {
    console.log('main:save-file', filePath, content);
    const result = await saveFile(filePath, content);
    result.success
      ? event.sender.send('save-file-success', result.success)
      : event.sender.send('save-file-failure', result.success);
  });

  ipcMain.on('rename-file', async (event: IpcMainEvent, { oldPath, newTitle }) => {
    console.log('main:rename-file', oldPath, newTitle);
    const result = await renameFile(oldPath, newTitle);
    result.success
      ? event.sender.send('rename-file-success', result)
      : event.sender.send('rename-file-failure', result);
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

/* this is used to retrieve the Multi-purpose Internet Mail Extension (MIME) type of the image,
 so as to correctly encode base64 image data */
const getMimeType = (filePath: string): string => {
  const extension = filePath.toLowerCase();
  if (extension.endsWith('.png')) return 'image/png';
  if (extension.endsWith('.webp')) return 'image/webp';
  if (extension.endsWith('.svg')) return 'image/svg+xml';
  if (extension.endsWith('.gif')) return 'image/gif'; // in case the .gif type ever needs to be processed
  return 'image/jpeg'; // the default extension for .jpg, .jpeg...
};
