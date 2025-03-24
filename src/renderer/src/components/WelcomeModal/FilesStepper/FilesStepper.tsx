import { Space, Title, Button as MantineButton, Text } from '@mantine/core';
import { useSharedData } from '../../../providers/SharedDataProvider';
import classes from './FilesStepper.module.css';
import { IconChevronDown } from '@tabler/icons-react';

export const FileStepper = (): JSX.Element => {
  const { rootDirPath, setRootDirPath } = useSharedData();

  const handleDirectorySelect = async (): Promise<void> => {
    try {
      // asynchronously communicates with backend, so must wait for a response with `await`
      const directory = await window.ipcAPI.openDirectorySelector();
      if (directory) {
        setRootDirPath(directory);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  return (
    <div className={classes.stepperContent}>
      <div className={classes.stepperTitle}>
        <Title order={1} className={classes.title}>
          welcome to nodepad.
        </Title>
      </div>
      <Space h="md" />
      <div className={classes.stepperContent}>
        <Text className={classes.text}>
          in order to take notes, you need to select a place to store them.
        </Text>
        <Space h="md" />
        <Text className={classes.text}>please select where you&apos;d like to keep them:</Text>
        <Space h="md" />
        <Space h="md" />
        <MantineButton
          className={classes.selectFolderButton}
          variant="subtle"
          leftSection={<IconChevronDown />}
          onClick={handleDirectorySelect}
        >
          {rootDirPath || 'select directory'}
        </MantineButton>
        <Space h="md" />
      </div>
    </div>
  );
};
