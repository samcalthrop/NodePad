import classes from '../LoginScreen/LoginScreen.module.css';
import { Screen } from '../Screen';
import { useNavigate } from 'react-router-dom';
import { Button, Title, TextInput, Group, PasswordInput, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback, useState } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { UserCredential } from '@renderer/types';

export const SignUpScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<UserCredential>();

  // defining the rules for the login form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      reEnterPassword: '',
      remember: false,
    },

    // in-browser validation of email entry
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Invalid password'),
      reEnterPassword: (value, values) =>
        value === values.password ? null : 'Passwords must match',
    },
  });

  const handleSubmit = useCallback(async (): Promise<void> => {
    const { email, password }: UserCredential = form.getValues();
    const result = await window.ipcAPI.createCredentials(email, password);
    if (result) {
      setCredentials({ email, password });
      console.log(credentials);
      navigate('/login');
    } else {
      console.log('Email already taken');
      alert(
        "The email '" + email + "' is already in use. Try logging in, or using a different email"
      );
    }
  }, [form]);

  return (
    <Screen>
      <div className={classes.root}>
        <div className={classes.base}>
          <br />
          <Group align="center" className={classes.titleGroup}>
            <ActionIcon
              className={classes.leftArrow}
              variant="transparent"
              c="var(--mantine-color-defaultScheme-5)"
              onClick={() => navigate('/login')}
              size={48}
            >
              <IconArrowLeft size={48} />
            </ActionIcon>
            <Title className={classes.title} order={1}>
              sign up
            </Title>
          </Group>
          <form
            className={classes.form}
            onSubmit={form.onSubmit((values) => {
              console.log('onSubmit', { values });
              handleSubmit();
            })}
          >
            {/* username field */}
            <TextInput
              styles={{
                input: {
                  background: 'var(--mantine-color-defaultScheme-2)',
                  color: 'var(--mantine-color-defaultScheme-6)',
                  borderColor: 'var(--mantine-color-defaultScheme-2)',
                },
                label: {
                  color: 'var(--mantine-color-defaultScheme-4)',
                },
              }}
              withAsterisk
              label="email"
              placeholder="your@email.com"
              key={form.key('email')}
              {...form.getInputProps('email')}
            />

            {/* password field */}
            <PasswordInput
              styles={{
                input: {
                  background: 'var(--mantine-color-defaultScheme-2)',
                  color: 'var(--mantine-color-defaultScheme-6)',
                  borderColor: 'var(--mantine-color-defaultScheme-2)',
                },
                label: {
                  color: 'var(--mantine-color-defaultScheme-4)',
                },
                description: {
                  color: 'var(--mantine-color-defaultScheme-3)',
                },
              }}
              withAsterisk
              label="password"
              description="ensure password length is at least 8 characters long"
              placeholder="password-123"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />

            {/* re-enter password field */}
            <PasswordInput
              styles={{
                input: {
                  background: 'var(--mantine-color-defaultScheme-2)',
                  color: 'var(--mantine-color-defaultScheme-6)',
                  borderColor: 'var(--mantine-color-defaultScheme-2)',
                },
                label: {
                  color: 'var(--mantine-color-defaultScheme-4)',
                },
              }}
              withAsterisk
              label="re-enter password"
              placeholder="password-123"
              key={form.key('reEnterPassword')}
              {...form.getInputProps('reEnterPassword')}
            />

            {/* form submission */}
            <Group justify="center" mt="md">
              <Button className={classes.submit} type="submit">
                submit
              </Button>
            </Group>
          </form>
        </div>
      </div>
    </Screen>
  );
};
