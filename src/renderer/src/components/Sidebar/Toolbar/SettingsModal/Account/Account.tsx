import { useForm } from '@mantine/form';
import classes from './Account.module.css';
import { Stack, Divider, TextInput, Group, Flex, Space, ActionIcon } from '@mantine/core';
import { IconAt, IconCamera, IconCornerDownLeft, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { useSharedData } from '../../../../../providers/SharedDataProvider';

export const Account = (): JSX.Element => {
  return (
    <Stack className={classes.stack}>
      <SubmissionForm />
      <Divider size="sm" className={classes.dividerSettingsComponent} />
    </Stack>
  );
};

const asyncSubmit = (values: unknown): unknown =>
  new Promise((resolve) => setTimeout(() => resolve(values), 1));

const SubmissionForm = (): JSX.Element => {
  const { email, setEmail, password, setPassword } = useSharedData();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const at = <IconAt size={16} stroke={1.5} color="var(--mantine-color-defaultScheme-6)" />;
  const lock = <IconLock size={16} stroke={1.5} color="var(--mantine-color-defaultScheme-6)" />;

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
            <IconCamera className={classes.cameraIcon} size={80} stroke={1} />
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
