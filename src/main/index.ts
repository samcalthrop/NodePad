import { app, shell, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { TreeNodeData } from '@mantine/core';
import icon from '../../resources/icon.png?asset';
import { getTreeNodeData } from './getTreeNodeData';
// import * as fs from 'fs';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
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
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // - TESTING
  // mainWindow.webContents.send('data-send', data);

  // - dev tools
  mainWindow.webContents.openDevTools({ mode: 'right' });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools with F12
  // ( https://github.com/alex8088/electron-toolkit/tree/master/packages/utils )
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', (event: IpcMainEvent, args) => {
    console.log('pong', { event, args });
  });

  ipcMain.on('get-tree-node-data', (event: IpcMainEvent) => {
    const data: TreeNodeData[] = getTreeNodeData();
    event.sender.send('get-tree-node-data-success', data);
    console.log('done!');
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // - TESTING
  ipcMain.on('send-data', (event: IpcMainEvent, args) => {
    console.log('data sent from front end to backend', { event, args });
  });
  // -
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// TESTING FILE OPENING:
// let fileContents: string = '';

// fs.readFile('README.md', (err, inputD) => {
//   if (err) throw err;
//   fileContents = inputD.toString();
//   console.log(fileContents);
// });
