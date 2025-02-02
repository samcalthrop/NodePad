import classes from './HomeViewScreen.module.css';
import { TreeNodeData } from '@mantine/core';
import { NodeNetwork } from '@renderer/components/NodeNetwork/NodeNetwork';
import { useEffect, useState } from 'react';

export const HomeViewScreen = (): JSX.Element => {
  const path = './writeup';
  const [treeNodeData, setTreeNodeData] = useState<Array<TreeNodeData>>([]);

  // retrieving the treeNodeData from the backend
  useEffect(() => {
    window.ipcAPI.getTreeNodeData(path).then((treeNodeData) => {
      setTreeNodeData(treeNodeData);
    });
  }, []);
  for (const node of treeNodeData) {
    console.log(node.children);
  }

  return (
    <div className={classes.root}>
      <div className={classes.network}>
        <NodeNetwork files={treeNodeData} />
      </div>
    </div>
  );
};
