import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import classes from './CreateFileButton.module.css';
import { useSharedData } from '../../../../providers/SharedDataProvider';
import { CreateFileProps } from '../../../../types';
import { useNavigate } from 'react-router-dom';

export const CreateFile = ({ filePath, name, files }: CreateFileProps): JSX.Element => {
  const { counter, setCounter, setNewFileCreated, setSelectedFile, setSelectedTreeNodeData } =
    useSharedData();
  const navigate = useNavigate();

  if (!counter) setCounter(1);

  const createNewFile = (): void => {
    window.ipcAPI.saveFile(filePath + '/' + name + ' ' + counter + '.md', ' ');

    // tells text editor what file to open
    setSelectedTreeNodeData({
      label: name + ' ' + counter,
      value: filePath + '/' + name + ' ' + counter + '.md',
    });
    setSelectedFile(name + ' ' + counter);
    // title of file will be autofocused so user can quickly rename from 'new file X'
    setNewFileCreated(true);
    console.log(`navigating to ${name + ' ' + counter}`);
    navigate('/home/edit-node-meta');
    setCounter((counter ?? 1) + 1);
    // if a new file is created, autofocus the title of the file when entering text editor
    setNewFileCreated(true);
  };

  if (files.length > 0) {
    return (
      <Button
        className={classes.fileButton}
        title="Create File"
        variant="default"
        onClick={createNewFile}
      >
        <IconPlus size={32} />
      </Button>
    );
  }
  return <></>;
};
