import classes from './HomeViewScreen.module.css';
import { Title, TreeNodeData } from '@mantine/core';
// import { Center, SegmentedControl, rem } from '@mantine/core';
// import { IconEye, IconPencil } from '@tabler/icons-react';
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
        <Title order={1}>Home</Title>
        {/* <SegmentedControl
            data={[
              {
                value: 'preview',
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconEye style={{ width: rem(16), height: rem(16) }} />
                  </Center>
                ),
              },
              {
                value: 'edit',
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconPencil style={{ width: rem(16), height: rem(16) }} />
                  </Center>
                ),
              },
            ]}
            radius="lg"
          /> */}
        <NodeNetwork files={treeNodeData} />
      </div>
    </div>
  );
};
