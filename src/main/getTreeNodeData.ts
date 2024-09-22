import { TreeNodeData } from '@mantine/core';
import directoryTree, { DirectoryTree } from 'directory-tree';

export const convertDirectoryTree = ({ name, path, children }: DirectoryTree): TreeNodeData => ({
  label: name,
  value: path,
  children: children ? children.map(convertDirectoryTree) : undefined,
});

// export const convertDirectoryTree = (dirTree: DirectoryTree): TreeNodeData => {
//   if (dirTree.children === undefined) {
//     return {
//       label: dirTree.name,
//       value: dirTree.path,
//     };
//   }

//   return {
//     label: dirTree.name,
//     value: dirTree.path,
//     children: dirTree.children.map(convertDirectoryTree),
//   };
// };

export const getTreeNodeData = (): TreeNodeData[] => {
  const tree = directoryTree('.', { extensions: /\.md$/ });
  console.log(tree);

  return [convertDirectoryTree(tree)];

  // hardcoded data
  // return [
  //   {
  //     label: 'src',
  //     value: 'src',
  //     children: [
  //       {
  //         label: 'components',
  //         value: 'src/components',
  //         children: [
  //           { label: 'Accordion.tsx', value: 'src/components/Accordion.tsx' },
  //           { label: 'Tree.tsx', value: 'src/components/Tree.tsx' },
  //           { label: 'Button.tsx', value: 'src/components/Button.tsx' },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     label: 'node_modules',
  //     value: 'node_modules',
  //     children: [
  //       {
  //         label: 'react',
  //         value: 'node_modules/react',
  //         children: [
  //           { label: 'index.d.ts', value: 'node_modules/react/index.d.ts' },
  //           { label: 'package.json', value: 'node_modules/react/package.json' },
  //         ],
  //       },
  //       {
  //         label: '@mantine',
  //         value: 'node_modules/@mantine',
  //         children: [
  //           {
  //             label: 'core',
  //             value: 'node_modules/@mantine/core',
  //             children: [
  //               { label: 'index.d.ts', value: 'node_modules/@mantine/core/index.d.ts' },
  //               { label: 'package.json', value: 'node_modules/@mantine/core/package.json' },
  //             ],
  //           },
  //           {
  //             label: 'hooks',
  //             value: 'node_modules/@mantine/hooks',
  //             children: [
  //               { label: 'index.d.ts', value: 'node_modules/@mantine/core/index.d.ts' },
  //               { label: 'package.json', value: 'node_modules/@mantine/core/package.json' },
  //             ],
  //           },
  //           {
  //             label: 'form',
  //             value: 'node_modules/@mantine/form',
  //             children: [
  //               { label: 'index.d.ts', value: 'node_modules/@mantine/core/index.d.ts' },
  //               { label: 'package.json', value: 'node_modules/@mantine/core/package.json' },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     label: 'package.json',
  //     value: 'package.json',
  //   },
  //   {
  //     label: 'tsconfig.json',
  //     value: 'tsconfig.json',
  //   },
  //   {
  //     label: 'tsconfig.lib.json',
  //     value: 'tsconfig.lib.json',
  //   },
  // ];
};
