import { useForm } from '@mantine/form';
import classes from './SettingsModal.module.css';
import {
  Modal,
  Button,
  Tabs,
  Text,
  Stack,
  Button as MantineButton,
  Divider,
  TextInput,
  Group,
  Flex,
  Space,
  ActionIcon,
  Title,
  ScrollArea,
  NativeSelect,
  Checkbox,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAt,
  IconCamera,
  IconChevronDown,
  IconCornerDownLeft,
  IconLock,
  IconSettings,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';

export const SettingsModal = (): JSX.Element => {
  // react state used to globally keep track of if settings is open
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {/* the skeleton of the pop-over page */}
      <Modal.Root
        className={classes.modal}
        opened={opened}
        onClose={close}
        centered
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'normal',
          },
        }}
      >
        {/* the behaviour of the background when settings is open */}
        <Modal.Overlay backgroundOpacity={0.2} blur={1.8} />
        {/* the content to be displayed within the pop-over */}
        <Modal.Content radius="13px" className={classes.content}>
          {/* the 'sidebar' where the menu of settings will be displayed */}
          <NavBar />
        </Modal.Content>
      </Modal.Root>

      {/* the button that will appear in the toolbar */}
      <Button className={classes.settingsButton} variant="default" onClick={open}>
        <IconSettings size={32} />
      </Button>
    </>
  );
};

const NavBar = (): JSX.Element => {
  const [section, setSection] = useState<string>('appearance');

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Title className={classes.title}>settings</Title>
        <Title className={classes.section}>{section}</Title>
        <Modal.CloseButton className={classes.close} size="xl" />
      </div>
      <div className={classes.dividerContainer}>
        <div className={classes.behindDividerNavBar}>
          <Divider size="sm" className={classes.dividerNavBar} />
        </div>
        <div className={classes.behindDividerContentArea}>
          <Divider size="sm" className={classes.dividerContentArea} />
        </div>
      </div>
      <Tabs
        className={classes.tabs}
        color="var(--mantine-color-defaultScheme-2)"
        defaultValue="appearance"
        variant="pills"
        orientation="vertical"
        radius={0}
        onChange={(value) => setSection(value || 'appearance')}
      >
        <Tabs.List className={classes.navbar}>
          <Tabs.Tab className={classes.tab} value="appearance">
            appearance
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="account">
            account
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="files">
            files
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="help">
            help
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel className={classes.panel} value="files" onClick={() => setSection('files')}>
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Files />
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel
          className={classes.panel}
          value="appearance"
          onClick={() => setSection('appearance')}
        >
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Appearance />
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel className={classes.panel} value="account" onClick={() => setSection('account')}>
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Account />
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel className={classes.panel} value="help" onClick={() => setSection('help')}>
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Help />
          </ScrollArea.Autosize>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

// modularising each component of the Navbar
const Appearance = (): JSX.Element => {
  const { boids, setBoids } = useSharedData();
  return (
    <Stack className={classes.stack}>
      <div className={classes.settingComponent}>
        <Title className={classes.settingsSubHeading} size="h2">
          network
        </Title>
        <Text className={classes.text}>determine the characteristics of the network of nodes</Text>
        {/* <Space h="md" /> */}
        <Title className={classes.settingsComponentTitle} size="h3">
          boid&apos;s network
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>
            decide whether boid&apos;s algorithm is applied to the network - this essentially allows
            the nodes to move autonomously, similarly to how a flock of birds moves in the sky
          </Text>
          <Space h="md" />
          <Checkbox
            color="var(--mantine-color-defaultScheme-5)"
            className={classes.checkbox}
            label={boids ? "boid's will run" : "boid's won't run"}
            checked={boids}
            onChange={(event) => setBoids(event.currentTarget.checked)}
            wrapperProps={{
              onClick: () => setBoids((isChecked) => !isChecked),
            }}
          />
        </div>
      </div>

      <Divider size="sm" className={classes.dividerSettingsComponent} />
    </Stack>
  );
};

const Account = (): JSX.Element => {
  return (
    <Stack className={classes.stack}>
      <SubmissionForm />
      <Divider size="sm" className={classes.dividerSettingsComponent} />
    </Stack>
  );
};

const Files = (): JSX.Element => {
  // data provider used to keep track of the selected root directory
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

const Help = (): JSX.Element => {
  return <Stack className={classes.stack}>{/* stuff */}</Stack>;
};

const asyncSubmit = (values: unknown): unknown =>
  new Promise((resolve) => setTimeout(() => resolve(values), 1));

const SubmissionForm = (): JSX.Element => {
  const { email, setEmail, password, setPassword } = useSharedData();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const at = <IconAt size={16} stroke={1.5} />;
  const lock = <IconLock size={16} stroke={1.5} />;

  const formEmail = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '' },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'invalid email'),
    },
  });
  const formPassword = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '' },

    validate: {
      password: (value) => (value.length >= 8 ? null : 'invalid password'),
    },
  });

  const handleSubmitEmail = async (values: typeof formEmail.values): Promise<void> => {
    const oldEmail = email || 'email'; // email could be undefined
    const result = await window.ipcAPI.updateEmail(oldEmail, values.email);
    if (result) {
      await asyncSubmit(values);
      setEmail(values.email); // set the submitted value as the new placeholder
    }
    formEmail.reset(); // reset the form to empty the input
  };

  const handleSubmitPassword = async (values: typeof formPassword.values): Promise<void> => {
    const result = await window.ipcAPI.updatePassword(
      email || 'email',
      values.password || 'password'
    ); // email and/ or password could be undefined
    if (result) {
      await asyncSubmit(values);
      setPassword(values.password); // set the submitted value as the new placeholder
    }
    formPassword.reset(); // reset the form to empty the input
  };

  const handleImageClick = async (): Promise<void> => {
    try {
      const imgData = await window.ipcAPI.openFileSelector({
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      });
      if (imgData) {
        setProfileImage(imgData);
      }
    } catch (error) {
      console.error('Failed to select image: ', error);
    }
  };

  return (
    <Stack>
      <Space h="sm" />
      <Flex align="center" gap="var(--padding-default)">
        <div className={classes.profileImg} onClick={handleImageClick}>
          {profileImage ? (
            <img
              src={profileImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <IconCamera className={classes.cameraIcon} size={80} stroke={1.5} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Space h="sm" />

          <form onSubmit={formEmail.onSubmit(handleSubmitEmail)}>
            <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="wrap">
              <TextInput
                styles={{
                  input: {
                    background: 'var(--mantine-color-defaultScheme-2)',
                    color: 'var(--mantine-color-defaultScheme-6)',
                    borderColor: 'var(--mantine-color-defaultScheme-2)',
                    width:
                      'calc(var(--content-area-width) - var(--profile-img-width) - 3 * var(--padding-default) - 50px)',
                  },
                  label: {
                    color: 'var(--mantine-color-defaultScheme-4)',
                  },
                }}
                leftSection={at}
                placeholder={email}
                key={formEmail.key('email')}
                {...formEmail.getInputProps('email')}
                width="100%"
              />

              <Group justify="flex-end">
                <ActionIcon
                  variant="transparent"
                  aria-label="submit"
                  type="submit"
                  loaderProps={{ type: 'dots' }}
                  size="lg"
                  c="var(--mantine-color-defaultScheme-5)"
                >
                  {/* <IconCheck stroke={2} /> */}
                  <IconCornerDownLeft />
                </ActionIcon>
              </Group>
            </Flex>
          </form>

          <Space h="sm" />
          {/* <Divider size="sm" className={classes.dividerSettingsComponent} /> */}
          <Space h="sm" />

          <form onSubmit={formPassword.onSubmit(handleSubmitPassword)}>
            <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="wrap">
              <TextInput
                styles={{
                  input: {
                    background: 'var(--mantine-color-defaultScheme-2)',
                    color: 'var(--mantine-color-defaultScheme-6)',
                    borderColor: 'var(--mantine-color-defaultScheme-2)',
                    width:
                      'calc(var(--content-area-width) - var(--profile-img-width) - 3 * var(--padding-default) - 50px)',
                  },
                  label: {
                    color: 'var(--mantine-color-defaultScheme-4)',
                  },
                }}
                leftSection={lock}
                placeholder={password}
                key={formPassword.key('password')}
                {...formPassword.getInputProps('password')}
              />

              <Group justify="flex-end">
                <ActionIcon
                  variant="transparent"
                  aria-label="submit"
                  type="submit"
                  loaderProps={{ type: 'dots' }}
                  size="lg"
                  c="var(--mantine-color-defaultScheme-5)"
                >
                  {/* <IconArrowRight stroke={2} /> */}
                  <IconCornerDownLeft />
                </ActionIcon>
              </Group>
            </Flex>
          </form>
        </div>
      </Flex>
      <Space h="xs" />
    </Stack>
  );
};
