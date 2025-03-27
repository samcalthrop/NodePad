import { TreeNodeData } from '@mantine/core';
import directoryTree, { DirectoryTree } from 'directory-tree';

// returns a given directory tree in the Array<TreeNodeData> form
export const convertDirectoryTree = ({ name, path, children }: DirectoryTree): TreeNodeData => ({
  label: name,
  value: path,
  children: children ? children.map(convertDirectoryTree) : undefined,
});

// returns Array<TreeNodeData> from a given path
export const getTreeNodeData = (path: string): TreeNodeData[] => {
  const tree = directoryTree(path, { extensions: /\.(md|png|jpg|jpeg|gif)$/ });
  // debug log
  console.log(tree);

  return [convertDirectoryTree(tree)];
};
