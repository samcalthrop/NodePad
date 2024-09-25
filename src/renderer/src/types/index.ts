import { TreeNodeData } from '@mantine/core';

export type DrawFunc = (frameCount: number, context: CanvasRenderingContext2D) => void;

export type GetTreeNodeData = (path: string) => Promise<Array<TreeNodeData>>;

export type GetFileContents = (path: string) => Promise<string>;

export type IpcAPI = {
  getTreeNodeData: GetTreeNodeData;
  getFileContents: GetFileContents;
};

// export type NetworkNodeData = TreeNodeData & {
//   connections: Array<TreeNodeData>;
//   tags: Array<string>;
// };
