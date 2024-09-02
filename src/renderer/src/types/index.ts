import { TreeNodeData } from '@mantine/core';

export type DrawFunc = (frameCount: number, context: CanvasRenderingContext2D) => void;

export type GetTreeNodeData = () => Promise<Array<TreeNodeData>>;

export type IpcAPI = {
  getTreeNodeData: GetTreeNodeData;
};

// export type NetworkNodeData = TreeNodeData & {
//   connections: Array<TreeNodeData>;
//   tags: Array<string>;
// };
