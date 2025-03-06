import classes from './HomeViewScreen.module.css';
import { TreeNodeData } from '@mantine/core';
import { NodeNetwork } from '../../../components/NodeNetwork/NodeNetwork';
import { useSharedData } from '../../../providers/SharedDataProvider';
import { useEffect, useState } from 'react';

export const HomeViewScreen = (): JSX.Element => {
  const [treeNodeData, setTreeNodeData] = useState<Array<TreeNodeData>>([]);
  const { rootDirPath, counter } = useSharedData();

  // retrieving the treeNodeData from the backend
  useEffect(() => {
    if (rootDirPath) {
      window.ipcAPI.getTreeNodeData(rootDirPath).then((treeNodeData) => {
        setTreeNodeData(treeNodeData);
      });
    }
  }, [rootDirPath, counter]);
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
