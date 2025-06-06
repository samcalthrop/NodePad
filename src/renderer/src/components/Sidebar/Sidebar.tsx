import classes from './Sidebar.module.css';
import { ReactElement, useEffect, useState } from 'react';
import {
  Group,
  Tree,
  TreeNodeData,
  RenderTreeNodePayload,
  Title,
  Divider,
  ScrollArea,
  Box,
  Text,
} from '@mantine/core';
import { NpmIcon } from '@mantinex/dev-icons';
import { IconBook, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { useSharedData } from '../../providers/SharedDataProvider';
import { useNavigate } from 'react-router-dom';
import { SettingsModal } from './Toolbar/SettingsModal/SettingsModal';
import { HomeButton } from './Toolbar/HomeButton/HomeButton';
import { CreateFile } from './Toolbar/CreateFileButton/CreateFileButton';
import { FileIconProps } from '../../types';

export const Sidebar = (): JSX.Element => {
  const [treeNodeData, setTreeNodeData] = useState<Array<TreeNodeData>>([]);
  const { rootDirPath, title, counter } = useSharedData();

  // retrieving the treeNodeData from the backend
  useEffect(() => {
    if (rootDirPath) {
      window.ipcAPI.getTreeNodeData(rootDirPath).then((treeNodeData) => {
        setTreeNodeData(treeNodeData[0]?.children || []);
      });
    }
  }, [rootDirPath, title, counter]);

  return (
    <div className={classes.root}>
      <div className={classes.titleDiv}>
        <Title className={classes.title} order={1}>
          {rootDirPath?.split('/').pop() ?? 'files'}
        </Title>
      </div>
      <Divider className={classes.divider} size="sm" />
      <div className={classes.filetreeDiv}>
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
              data={treeNodeData ? treeNodeData : []}
              renderNode={(payload) => <Leaf {...payload} />}
            />
          </Box>
        </ScrollArea.Autosize>
      </div>
      <Divider className={classes.divider} size="sm" />
      <div className={classes.toolbar}>
        <SettingsModal />
        <HomeButton />
        <CreateFile filePath={rootDirPath ?? '~'} name="new file" files={treeNodeData} />
      </div>
    </div>
  );
};

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
  const { setSelectedTreeNodeData, setSelectedFile, setNewFileCreated } = useSharedData();
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
          console.log(`navigating to ${node.value.split('/').pop()?.replace('.md', '')}`);
          setSelectedTreeNodeData(node);
          setSelectedFile(node.value.split('/').pop()?.replace('.md', '') || '');
          // when an existing file is clicked, autofocus the content of the editor
          setNewFileCreated(false);
          navigate('/home/edit-node-meta');
        }
      }}
    >
      <div className={classes.leaf}>
        <FileIcon name={node.value} isFolder={hasChildren} expanded={expanded} />
        <Text className={classes.leafText}>{node.label}</Text>
      </div>
    </Group>
  );
}
