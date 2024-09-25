import { TreeNodeData } from '@mantine/core';
import directoryTree, { DirectoryTree } from 'directory-tree';
const fs = require('node:fs');

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

export const getFileContents = (path: string): string | void => {
  let fileContents: string = '';
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    fileContents = data;
    console.log(fileContents);
  });
  return fileContents;
};
