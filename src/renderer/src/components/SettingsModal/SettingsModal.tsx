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
  SimpleGrid,
  TextInput,
  Group,
  Flex,
  Space,
  ActionIcon,
  Title,
  ScrollArea,
  NativeSelect,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAt,
  IconChevronDown,
  IconCornerDownLeft,
  IconLock,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';

export const SettingsModal = (): JSX.Element => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
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
        <Modal.Overlay backgroundOpacity={0.2} blur={1.8} />
        <Modal.Content radius="13px" className={classes.content}>
          <NavBar />
        </Modal.Content>
      </Modal.Root>

      <Button variant="default" onClick={open}>
        <IconSettings />
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
      <div>
        <Divider />
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

const Appearance = (): JSX.Element => {
  return (
    <Stack className={classes.stack}>
      <SimpleGrid
        cols={2}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        <div>
          <Button>dark</Button>
        </div>
        <div>
          <Button>light</Button>
        </div>
        <div>
          <Button>midnight</Button>
        </div>
        <div>
          <Button>custom...</Button>
        </div>
      </SimpleGrid>
    </Stack>
  );
};

const Account = (): JSX.Element => {
  return (
    <Stack className={classes.stack}>
      <SubmissionForm />
    </Stack>
  );
};

const Files = (): JSX.Element => {
  const { rootDirPath, setRootDirPath } = useSharedData();
  const [saveFrequency, setSaveFrequency] = useState('5');

  const handleDirectorySelect = async (): Promise<void> => {
    try {
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

        <Divider />

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
                { label: 'every 5s', value: '5' },
                { label: 'every 10s', value: '10' },
                { label: 'every 30s', value: '30' },
                { label: 'never (manual saving)', value: 'manual' },
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
  const [name, setName] = useState('name');
  const [email, setEmail] = useState('email');
  const [password, setPassword] = useState('password');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const at = <IconAt size={16} stroke={1.5} />;
  const lock = <IconLock size={16} stroke={1.5} />;
  const user = <IconUser size={16} stroke={1.5} />;

  const formName = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '' },
  });
  const formEmail = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '' },
  });
  const formPassword = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '' },
  });

  const handleSubmitName = async (values: typeof formName.values): Promise<void> => {
    await asyncSubmit(values);
    setName(values.name); // set the submitted value as the new placeholder
    formName.reset(); // reset the form to empty the input
  };
  const handleSubmitEmail = async (values: typeof formEmail.values): Promise<void> => {
    await asyncSubmit(values);
    setEmail(values.email); // set the submitted value as the new placeholder
    formEmail.reset(); // reset the form to empty the input
  };
  const handleSubmitPassword = async (values: typeof formPassword.values): Promise<void> => {
    await asyncSubmit(values);
    setPassword(values.password); // set the submitted value as the new placeholder
    formPassword.reset(); // reset the form to empty the input
  };
  const handleImageClick = async (): Promise<void> => {
    try {
      const imgData = await window.ipcAPI.openFileSelector();
      if (imgData) {
        setProfileImage(imgData);
      }
    } catch (error) {
      console.error('Failed to select image: ', error);
    }
  };

  return (
    // MOVE STYLING TO CSS FILE
    <Flex align="center" gap="xl">
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '60px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '2px solid var(--mantine-color-dark-4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--mantine-color-defaultScheme-0)',
        }}
        onClick={handleImageClick}
      >
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
          <IconUser size={60} stroke={1.5} color="var(--mantine-color-defaultScheme-1)" />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <Space h="sm" />

        <form onSubmit={formName.onSubmit(handleSubmitName)}>
          <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="wrap">
            <TextInput
              leftSection={user}
              placeholder={name}
              key={formName.key('name')}
              {...formName.getInputProps('name')}
            />

            <Group justify="flex-end">
              <ActionIcon
                variant="transparent"
                aria-label="submit"
                type="submit"
                loaderProps={{ type: 'dots' }}
                size="lg"
              >
                <IconCornerDownLeft />
              </ActionIcon>
            </Group>
          </Flex>
        </form>

        <Space h="sm" />
        <Divider />
        <Space h="sm" />

        <form onSubmit={formEmail.onSubmit(handleSubmitEmail)}>
          <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="wrap">
            <TextInput
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
              >
                {/* <IconCheck stroke={2} /> */}
                <IconCornerDownLeft />
              </ActionIcon>
            </Group>
          </Flex>
        </form>

        <Space h="sm" />
        <Divider />
        <Space h="sm" />

        <form onSubmit={formPassword.onSubmit(handleSubmitPassword)}>
          <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="wrap">
            <TextInput
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
              >
                {/* <IconArrowRight stroke={2} /> */}
                <IconCornerDownLeft />
              </ActionIcon>
            </Group>
          </Flex>
        </form>
      </div>
    </Flex>
  );
};
