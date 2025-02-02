import classes from './Sidebar.module.css';
import { ReactElement, useEffect, useState } from 'react';
import {
  Group,
  Tree,
  TreeNodeData,
  RenderTreeNodePayload,
  Title,
  Divider,
  Space,
  ScrollArea,
  Box,
  Text,
} from '@mantine/core';
import { NpmIcon } from '@mantinex/dev-icons';
import { IconBook, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import { HomeButton } from '../HomeButton/HomeButton';

export const Sidebar = (): JSX.Element => {
  const path = './writeup';
  const [treeNodeData, setTreeNodeData] = useState<Array<TreeNodeData>>([]);

  // retrieving the treeNodeData from the backend
  useEffect(() => {
    window.ipcAPI.getTreeNodeData(path).then((treeNodeData) => {
      setTreeNodeData(treeNodeData);
    });
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Title order={1}> Files </Title>
        {/* <Breadcrumbs></Breadcrumbs> */}
      </div>
      <Space h="md" />
      <Divider />
      <div className={classes.filetree}>
        <ScrollArea.Autosize
          className={classes.scrollableArea}
          type="scroll"
          offsetScrollbars
          viewportProps={{ style: { overflowX: 'hidden' } }}
          scrollHideDelay={100}
        >
          <Box>
            <Tree
              levelOffset="lg"
              className={classes.tree}
              selectOnClick
              clearSelectionOnOutsideClick
              data={treeNodeData}
              renderNode={(payload) => <Leaf {...payload} />}
            />
          </Box>
        </ScrollArea.Autosize>
      </div>
      <div className={classes.toolbar}>
        <SettingsModal />
        <HomeButton />
      </div>
    </div>
  );
};

// declaring the properties each file icon will have
interface FileIconProps {
  name: string;
  isFolder: boolean;
  expanded: boolean;
}

// returns the appropriate file icon for a particular file extension
function FileIcon({ name, isFolder, expanded }: FileIconProps): JSX.Element {
  if (name.endsWith('package.json')) {
    return <NpmIcon color="var(--mantine-color-defaultScheme-4)" size={14} />;
  }

  if (name.endsWith('.md')) {
    return <IconBook color="var(--mantine-color-defaultScheme-4)" size={14} />;
  }

  // returns an opened/ closed folder based on the boolean value `expanded`
  if (isFolder) {
    return expanded ? (
      <IconChevronDown color="var(--mantine-color-defaultScheme-4)" size={14} stroke={2.5} />
    ) : (
      <IconChevronRight color="var(--mantine-color-defaultScheme-4)" size={14} stroke={2.5} />
    );
  }

  return <></>;
}

function Leaf({
  node,
  expanded,
  hasChildren,
  elementProps,
  tree,
}: RenderTreeNodePayload): ReactElement<FileIconProps> {
  // making use of the SharedDataProvider and the custom hook useSharedData() to access the shared data
  const { setSelectedTreeNodeData } = useSharedData();
  const navigate = useNavigate();

  return (
    <Group
      gap={5}
      {...elementProps}
      onClick={() => {
        tree.toggleSelected(node.value);
        tree.toggleExpanded(node.value);
        if (!node.children) {
          console.log('Sidebar: node selected: ', node);
          // updating the shared data with the selected node
          setSelectedTreeNodeData(node);
          navigate('/home/edit-node-meta');
        }
      }}
    >
      <div className={classes.leaf}>
        <div></div>
        <FileIcon name={node.value} isFolder={hasChildren} expanded={expanded} />
        <Text className={classes.leafText}>{node.label}</Text>
      </div>
    </Group>
  );
}
