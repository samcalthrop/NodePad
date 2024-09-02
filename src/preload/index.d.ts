import { ElectronAPI } from '@electron-toolkit/preload';
import { IpcAPI } from '@renderer/types';

declare global {
  interface Window {
    electron: ElectronAPI;
    ipcAPI: IpcAPI;
  }
}
