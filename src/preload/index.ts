import { TreeNodeData } from '@mantine/core';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);

    // communication between front and backend for data transfer (tree node data)
    // adapted from: https://www.jsgarden.co/blog/how-to-handle-electron-ipc-events-with-typescript
    contextBridge.exposeInMainWorld('ipcAPI', {
      getTreeNodeData: (path: string) => {
        ipcRenderer.send('get-tree-node-data', path);

        return new Promise((resolve) => {
          ipcRenderer.once('get-tree-node-data-success', (_event, data: Array<TreeNodeData>) =>
            resolve(data)
          );
        });
      },
      // communication between front and backend for data transfer (contents of selected file)
      getFileContents: (path: string) => {
        ipcRenderer.send('get-file-contents', path);

        return new Promise((resolve) => {
          ipcRenderer.on('get-file-contents-success', (_event, fileContents: string) => {
            console.log('on get-file-contents-success: fileContents:', fileContents);
            resolve(fileContents);
          });
        });
      },
      openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),
      openFileSelector: (options) => ipcRenderer.invoke('open-file-selector', options),
      createCredentials: (email: string, password: string) => {
        console.log('preload:createCredentials', { email, password });
        ipcRenderer.send('create-credentials', { email, password });

        return new Promise((resolve) => {
          ipcRenderer.on('create-credentials-success', (_event, success) => {
            console.log('on create-credentials-success');
            resolve(success);
          });
          ipcRenderer.on('create-credentials-failure', (_event, success) => {
            console.log('on create-credentials-failure');
            resolve(success);
          });
        });
      },
      checkCredentials: (email: string, password: string) => {
        console.log('preload:checkCredentials', { email, password });
        ipcRenderer.send('check-credentials', { email, password });

        return new Promise((resolve) => {
          ipcRenderer.on('check-credentials-success', (_event, success) => {
            console.log('on check-credentials-success');
            resolve(success);
          });
          ipcRenderer.on('check-credentials-failure', (_event, success) => {
            console.log('on check-credentials-success');
            resolve(success);
          });
        });
      },
      saveFile: (filePath: string, content: string) => {
        console.log('preload:saveFile', { filePath, content });
        ipcRenderer.send('save-file', { filePath, content });

        return new Promise((resolve) => {
          ipcRenderer.on('save-file-success', (_event, success) => {
            console.log('on save-file-success');
            resolve(success);
          });
          ipcRenderer.on('save-file-failure', (_event, success) => {
            console.log('on save-file-failure');
            resolve(success);
          });
        });
      },
      renameFile: (oldPath: string, newTitle: string) => {
        console.log('preload:renameFile', { oldPath, newTitle });
        ipcRenderer.send('rename-file', { oldPath, newTitle });

        return new Promise((resolve) => {
          ipcRenderer.on('rename-file-success', (_event, message) => {
            console.log('on rename-file-success');
            resolve(message);
          });
          ipcRenderer.on('rename-file-failure', (_event, message) => {
            console.log('on rename-file-failure');
            resolve(message);
          });
        });
      },
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // // @ts-ignore (define in dts)
  // window.api = api;
}
