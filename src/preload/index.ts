import { TreeNodeData } from '@mantine/core';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);

    // communication between front and backend for data transfer (tree node data)
    // adapted from: https://www.jsgarden.co/blog/how-to-handle-electron-ipc-events-with-typescript

    // expose these functions to the backend (main):
    contextBridge.exposeInMainWorld('ipcAPI', {
      // retrieves file structure from given path, in TreeNodeData[] format
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

      // triggers native filesystem GUI (for folder selection)
      openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),

      // triggers native filesystem GUI (for file selection)
      openFileSelector: (options) => ipcRenderer.invoke('open-file-selector', options),

      // returns the path to the resource directory, for media retrieval and display
      getResourcePath: () => ipcRenderer.invoke('getResourcePath'),

      // creates new record in db
      createCredentials: (email: string, password: string) => {
        // debug
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

      // checks credentials against existing entries in db
      checkCredentials: (email: string, password: string) => {
        // debug
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

      // updates email field in the record with primary key of oldEmail in db
      updateEmail: (oldEmail: string, newEmail: string) => {
        // debug
        console.log('preload:updateEmail', { oldEmail, newEmail });
        ipcRenderer.send('update-email', { oldEmail, newEmail });

        return new Promise((resolve) => {
          ipcRenderer.on('update-email-success', (_event, success) => {
            console.log('on update-email-success');
            resolve(success);
          });
          ipcRenderer.on('update-email-failure', (_event, success) => {
            console.log('on update-email-failure');
            resolve(success);
          });
        });
      },

      // updates password field in the record with primary key of email in db
      updatePassword: (email: string, password: string) => {
        // debug
        console.log('preload:updatePassword', { email, password });
        ipcRenderer.send('update-password', { email, password });

        return new Promise((resolve) => {
          ipcRenderer.on('update-password-success', (_event, success) => {
            console.log('on update-password-success');
            resolve(success);
          });
          ipcRenderer.on('update-password-failure', (_event, success) => {
            console.log('on update-password-failure');
            resolve(success);
          });
        });
      },

      // saves file contents to a given filepath in user's filesystem
      saveFile: (filePath: string, content: string) => {
        // debug
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

      // renames a given file in user's filesystem
      renameFile: (oldPath: string, newTitle: string) => {
        // debug
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

      // retrieves all tags attached to the given file
      getFileTags: (filePath: string) => {
        // debug
        console.log('preload:get-file-tags', filePath);
        ipcRenderer.send('get-file-tags', filePath);

        return new Promise((resolve) => {
          ipcRenderer.on('get-file-tags-success', (_event, tags) => {
            console.log('on get-file-tags-success');
            resolve(tags);
          });
        });
      },

      // saves all tags attached to a file
      saveFileTags: (filePath: string, tags: Array<string>) => {
        // debug
        console.log('preload:save-file-tags', { filePath, tags });
        ipcRenderer.send('save-file-tags', { filePath, tags });

        return new Promise((resolve) => {
          ipcRenderer.on('save-file-tags-success', (_event, message) => {
            console.log('on save-file-tags-success');
            resolve(message);
          });
        });
      },

      // retrieves all the tags used in the files within the given root directory
      getGlobalTags: (directoryPath: string) => {
        // debug
        console.log('preload:get-global-tags', directoryPath);
        ipcRenderer.send('get-global-tags', directoryPath);

        return new Promise((resolve) => {
          ipcRenderer.on('get-global-tags-success', (_event, tags) => {
            console.log('on get-global-tags-success');
            resolve(tags);
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
