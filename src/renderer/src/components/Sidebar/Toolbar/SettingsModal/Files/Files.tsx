import classes from './Files.module.css';
import {
  Text,
  Stack,
  Button as MantineButton,
  Divider,
  Space,
  Title,
  NativeSelect,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useSharedData } from '../../../../../providers/SharedDataProvider';

export const Files = (): JSX.Element => {
  // data provider used to keep track of the selected root directory and frequency of save
  const { rootDirPath, setRootDirPath, saveFrequency, setSaveFrequency } = useSharedData();

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
    <div>
      <Stack className={classes.stack}>
        <div className={classes.settingComponent}>
          <Title className={classes.settingsComponentTitle} size="h3">
            source folder
          </Title>
          <div className={classes.settingsComponentContent}>
            <Text className={classes.text}>
              the root directory within which your notes will be stored
            </Text>
            <Space h="md" />
            <MantineButton
              className={classes.selectFolderButton}
              variant="subtle"
              leftSection={<IconChevronDown />}
              onClick={handleDirectorySelect}
            >
              {rootDirPath || 'select directory'}
            </MantineButton>
          </div>
        </div>

        <Divider size="sm" className={classes.dividerSettingsComponent} />

        <div className={classes.settingComponent}>
          <Title className={classes.settingsComponentTitle} size="h3">
            saving
          </Title>
          <div className={classes.settingsComponentContent}>
            <Text className={classes.text}>select the frequency of autosaving your notes</Text>
            <Space h="md" />
            <NativeSelect
              classNames={{
                root: classes.nsRoot,
                section: classes.nsSection,
                input: classes.nsInput,
                wrapper: classes.nsWrapper,
              }}
              variant="filled"
              leftSection={<IconChevronDown />}
              rightSection={<></>}
              value={saveFrequency}
              onChange={(event) => setSaveFrequency(event.currentTarget.value)}
              data={[
                { label: 'on change', value: 'on-change' },
                { label: 'every 1s', value: '1000' },
                { label: 'every 2s', value: '2000' },
                { label: 'every 5s', value: '5000' },
                { label: 'every 10s', value: '10000' },
              ]}
            />
          </div>
        </div>
      </Stack>
    </div>
  );
};
