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
  Fieldset,
  TextInput,
  Group,
  Flex,
  Space,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowRight,
  IconAt,
  IconCheck,
  IconCornerDownLeft,
  IconLock,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';

export const SettingsModal = (): JSX.Element => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="settings"
        centered
        size="xl"
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'normal',
          },
        }}
      >
        <Tabs color="dark" defaultValue="appearance" variant="pills" orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="appearance">appearance</Tabs.Tab>
            <Tabs.Tab value="account">account</Tabs.Tab>
            <Tabs.Tab value="files">files</Tabs.Tab>
            <Tabs.Tab value="help">help</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="files" pl="xl">
            <Files />
          </Tabs.Panel>

          <Tabs.Panel value="appearance" pl="xl">
            <Appearance />
          </Tabs.Panel>

          <Tabs.Panel value="account" pl="xl">
            <Account />
          </Tabs.Panel>

          <Tabs.Panel value="help" pl="xl">
            <Help />
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <Button variant="default" onClick={open}>
        <IconSettings />
      </Button>
    </>
  );
};

const Appearance = (): JSX.Element => {
  return (
    <Stack>
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
    <Stack>
      {/* <Fieldset legend="personal information">
        <TextInput label="your name" placeholder={namePlaceholder} />
        <TextInput label="email" placeholder={emailPlaceholder} mt="md" />
        <PasswordInput label="password" placeholder={passPlaceholder} mt="md" />
      </Fieldset> */}
      <SubmissionForm />
    </Stack>
  );
};

const Files = (): JSX.Element => {
  const [selectedDirectory, setSelectedDirectory] = useState<string>('');

  const handleDirectorySelect = async (): Promise<void> => {
    try {
      const directory = await window.ipcAPI.openDirectorySelector();
      if (directory) {
        setSelectedDirectory(directory);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  return (
    <div id="filesContents">
      <Stack>
        <Text size="lg">source folder</Text>
        <Text size="sm" c="dimmed">
          the root directory within which your notes will be stored
        </Text>
        <Text size="sm" c="dimmed">
          {selectedDirectory || 'No directory selected'}
        </Text>
        <MantineButton
          variant="default"
          style={{ alignSelf: 'flex-start' }}
          onClick={handleDirectorySelect}
        >
          select directory
        </MantineButton>

        <Divider />

        <Text size="lg" mt="xl">
          other things
        </Text>
        <Text size="sm" c="dimmed">
          bleh bleh bleh
        </Text>
      </Stack>
    </div>
  );
};

const Help = (): JSX.Element => {
  return <Stack>{/* stuff */}</Stack>;
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
    setName(values.name); // Set the submitted value as the new placeholder
    formName.reset(); // Reset the form to empty the input
  };
  const handleSubmitEmail = async (values: typeof formEmail.values): Promise<void> => {
    await asyncSubmit(values);
    setEmail(values.email); // Set the submitted value as the new placeholder
    formEmail.reset(); // Reset the form to empty the input
  };
  const handleSubmitPassword = async (values: typeof formPassword.values): Promise<void> => {
    await asyncSubmit(values);
    setPassword(values.password); // Set the submitted value as the new placeholder
    formPassword.reset(); // Reset the form to empty the input
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
          backgroundColor: 'var(--mantine-color-grey-9)',
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
          <IconUser size={60} stroke={1.5} color="var(--mantine-color-grey-8)" />
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
              disabled={formName.submitting}
              {...formName.getInputProps('name')}
            />

            <Group justify="flex-end">
              <ActionIcon
                variant="transparent"
                aria-label="submit"
                type="submit"
                loading={formName.submitting}
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
              disabled={formEmail.submitting}
              {...formEmail.getInputProps('email')}
              width="100%"
            />

            <Group justify="flex-end">
              <ActionIcon
                variant="transparent"
                aria-label="submit"
                type="submit"
                loaderProps={{ type: 'dots' }}
                loading={formEmail.submitting}
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
              disabled={formPassword.submitting}
              {...formPassword.getInputProps('password')}
            />

            <Group justify="flex-end">
              <ActionIcon
                variant="transparent"
                aria-label="submit"
                type="submit"
                loaderProps={{ type: 'dots' }}
                loading={formPassword.submitting}
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
