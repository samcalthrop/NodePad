import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import classes from './CreateFileButton.module.css';
import { useSharedData } from '../../../../providers/SharedDataProvider';
import { CreateFileProps } from '../../../../types';

export const CreateFile = ({ filePath, name, files }: CreateFileProps): JSX.Element => {
  const { counter, setCounter, setNewFileCreated } = useSharedData();

  if (!counter) setCounter(1);

  const createNewFile = (): void => {
    window.ipcAPI.saveFile(filePath + '/' + name + ' ' + counter + '.md', ' ');
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
