import { TreeNodeData } from '@mantine/core';

export type GetTreeNodeData = (path: string) => Promise<Array<TreeNodeData>>;

export type GetFileContents = (path: string) => Promise<string>;

export type IpcAPI = {
  getTreeNodeData: GetTreeNodeData;
  getFileContents: GetFileContents;
  openDirectorySelector: () => Promise<string>;
  openFileSelector: (options: {
    filters: Array<{ name: string; extensions: string[] }>;
  }) => Promise<string>;
  createCredentials: (email: string, password: string) => Promise<boolean>;
  checkCredentials: (email: string, password: string) => Promise<boolean>;
  updateEmail: (oldEmail: string, newEmail: string) => Promise<boolean>;
  updatePassword: (email: string, password: string) => Promise<boolean>;
  saveFile: (filePath: string, content: string) => Promise<boolean>;
  renameFile: (oldPath: string, newTitle: string) => Promise<renameReturnObject>;
  getResourcePath: () => Promise<string>;
};

declare global {
  interface Window {
    ipcAPI: IpcAPI;
  }
}

// export interface Window {
//   electron: {
//     openDirectorySelector: () => Promise<string>;
//   };
// }

export type Position = {
  x: number;
  y: number;
};

export interface Node {
  id: number;
  x: number;
  y: number;
  title: string;
  filePath: string;
  connections: Array<number>; // Array of connected node IDs
  mass: number | 1;
  vx: number | 0; // speed in x direction
  vy: number | 0; // speed in y direction
  radius: number;
  tags: Array<string>;
}

export interface Connection {
  from: number;
  to: number;
}

export interface NodeNetworkProps {
  files: Array<TreeNodeData>;
}
// declaring the properties each file icon will have

export type FileIconProps = {
  name: string;
  isFolder: boolean;
  expanded: boolean;
};

export type UserCredential = {
  email: string;
  password: string;
};

export type renameReturnObject = {
  success: boolean;
  path: string;
};

export type PhysicsControlsProps = {
  protectedRange: number;
  visualRange: number;
  avoidFactor: number;
  turnFactor: number;
  centeringFactor: number;
  matchingFactor: number;
  maxSpeed: number;
  nodeRadius: number;
  onUpdate: (param: string, value: number) => void;
};

export type CreateFileProps = {
  filePath: string;
  name: string;
  files: Array<TreeNodeData>;
};
