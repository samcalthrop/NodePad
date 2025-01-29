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
