import { TreeNodeData } from '@mantine/core';

export type DrawFunc = (frameCount: number, context: CanvasRenderingContext2D) => void;

export type GetTreeNodeData = (path: string) => Promise<Array<TreeNodeData>>;

export type GetFileContents = (path: string) => Promise<string>;

export type IpcAPI = {
  getTreeNodeData: GetTreeNodeData;
  getFileContents: GetFileContents;
};

// testing network stuff ------------------------------------

export interface Node {
  id: string;
  x: number;
  y: number;
  title: string;
  filePath: string;
  connections: string[]; // Array of connected node IDs
}

export interface Connection {
  from: string;
  to: string;
}

// ------------------------------------------------------------

// export type NetworkNodeData = TreeNodeData & {
//   connections: Array<TreeNodeData>;
//   tags: Array<string>;
// };
