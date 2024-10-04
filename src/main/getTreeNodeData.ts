import { TreeNodeData } from '@mantine/core';
import directoryTree, { DirectoryTree } from 'directory-tree';

export const convertDirectoryTree = ({ name, path, children }: DirectoryTree): TreeNodeData => ({
  label: name,
  value: path,
  children: children ? children.map(convertDirectoryTree) : undefined,
});

export const getTreeNodeData = (path: string): TreeNodeData[] => {
  const tree = directoryTree(path, { extensions: /\.md$/ });
  // debug log
  console.log(tree);

  return [convertDirectoryTree(tree)];
};
