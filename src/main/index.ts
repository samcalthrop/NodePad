import { app, shell, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { TreeNodeData } from '@mantine/core';
import icon from '../../resources/icon.png?asset';
import { getTreeNodeData } from './getTreeNodeData';
import { getFileContents } from './getFileContents';

function createWindow(): void {
  // Create the browser window.
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

  createWindow();

  app.on('activate', function () {
    // common on macOS to re-create a window when the
    // dock icon clicked & no other windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// quit when all windows are closed unless OS=macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
