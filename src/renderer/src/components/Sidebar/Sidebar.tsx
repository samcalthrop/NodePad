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
} from '@mantine/core';
import { CssIcon, NpmIcon, TypeScriptCircleIcon } from '@mantinex/dev-icons';
import { IconFolder, IconFolderOpen, IconBook } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = (): JSX.Element => {
  const path = '.';
  const [treeNodeData, setTreeNodeData] = useState<Array<TreeNodeData>>([]);

  // retrieving the treeNodeData from the backend
  useEffect(() => {
    window.ipcAPI.getTreeNodeData(path).then((treeNodeData) => {
      setTreeNodeData(treeNodeData);
    });
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.stuff}>
        <Title order={2}> Files </Title>
        <Space h="md" />
        <Divider />
        {/* <Breadcrumbs></Breadcrumbs> */}
      </div>
      <Tree
        classNames={classes}
        selectOnClick
        clearSelectionOnOutsideClick
        data={treeNodeData}
        renderNode={(payload) => <Leaf {...payload} />}
      />
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
    return <NpmIcon size={14} />;
  }

  if (
    name.endsWith('.ts') ||
    name.endsWith('.tsx') ||
    name.endsWith('tsconfig.json') ||
    name.endsWith('tsconfig.lib.json')
  ) {
    return <TypeScriptCircleIcon size={14} />;
  }

  if (name.endsWith('.css')) {
    return <CssIcon size={14} />;
  }

  if (name.endsWith('.md')) {
    return <IconBook size={14} />;
  }

  // returns an opened/ closed folder based on the boolean value `expanded`
  if (isFolder) {
    return expanded ? (
      <IconFolderOpen color="var(--mantine-color-yellow-9)" size={14} stroke={2.5} />
    ) : (
      <IconFolder color="var(--mantine-color-yellow-9)" size={14} stroke={2.5} />
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
  const navigate = useNavigate();

  return (
    <Group
      gap={5}
      {...elementProps}
      onClick={() => {
        tree.toggleSelected(node.value);
        tree.toggleExpanded(node.value);
        !node.children ? navigate('/edit-node-meta') : null;
      }}
    >
      <FileIcon name={node.value} isFolder={hasChildren} expanded={expanded} />
      <span>{node.label}</span>
    </Group>
  );
}
