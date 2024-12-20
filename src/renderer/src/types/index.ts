import { TreeNodeData } from '@mantine/core';

export type GetTreeNodeData = (path: string) => Promise<Array<TreeNodeData>>;

export type GetFileContents = (path: string) => Promise<string>;

export type IpcAPI = {
  getTreeNodeData: GetTreeNodeData;
  getFileContents: GetFileContents;
};

// testing network stuff ------------------------------------

export interface Node {
  id: number;
  x: number;
  y: number;
  title: string;
  filePath: string;
  connections: Array<number>; // Array of connected node IDs
}

export interface Connection {
  from: number;
  to: number;
}

export interface NodeNetworkProps {
  files: Array<TreeNodeData>;
}

// ------------------------------------------------------------

// export type NetworkNodeData = TreeNodeData & {
//   connections: Array<TreeNodeData>;
//   tags: Array<string>;
