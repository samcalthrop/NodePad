import { TreeNodeData } from '@mantine/core';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);

    // Adapted from: https://www.jsgarden.co/blog/how-to-handle-electron-ipc-events-with-typescript
    contextBridge.exposeInMainWorld('ipcAPI', {
      getTreeNodeData: () => {
        ipcRenderer.send('get-tree-node-data');

        return new Promise((resolve) => {
          ipcRenderer.once('get-tree-node-data-success', (_event, data: Array<TreeNodeData>) =>
            resolve(data)
          );
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
