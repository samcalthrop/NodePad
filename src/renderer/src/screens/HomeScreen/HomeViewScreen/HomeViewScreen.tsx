import classes from './HomeViewScreen.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text, TreeNodeData } from '@mantine/core';
// import { Center, SegmentedControl, rem } from '@mantine/core';
// import { IconEye, IconPencil } from '@tabler/icons-react';
import { MarkdownGraph } from '@renderer/components/MarkdownGraph/MarkdownGraph';
import { useEffect, useState } from 'react';

export const HomeViewScreen = (): JSX.Element => {
  const navigate = useNavigate();

  // testing network stuff ------------------------------------

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

  // ------------------------------------------------------------

  return (
    <div className={classes.root}>
      <div className={classes.thing}>
        <Title order={2}>Home</Title>
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
        <MarkdownGraph files={treeNodeData} />
        <Text>Edit node meta</Text>
        <Button
          variant="subtle"
          className={classes.button}
          onClick={() => navigate('../edit-node-meta')}
        >
          Ok
        </Button>
      </div>
    </div>
  );
};
