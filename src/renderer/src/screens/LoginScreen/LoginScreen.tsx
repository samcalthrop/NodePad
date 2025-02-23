import classes from './LoginScreen.module.css';
import { Screen } from '../Screen';
import { useNavigate } from 'react-router-dom';
import { Button, Title, TextInput, Text, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback } from 'react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';
// import { electronAPI } from '@electron-toolkit/preload';

export const LoginScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { setEmail, setPassword, setBoids } = useSharedData();

  // defining the rules for the login form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    // in-browser validation of email entry
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Invalid password'),
    },
  });

  const handleSubmit = useCallback(async (): Promise<void> => {
    const { email, password } = form.getValues();
    const result = await window.ipcAPI.checkCredentials(email, password);
    if (result) {
      // if credentials are valid, log in and assign the useSharedData() provider with user's credentials
      setEmail(email);
      setPassword(password);
      // set boids to apply after 5s of inactivity by default
      setBoids(true);
      navigate('/home');
    } else {
      console.log('User not found');
      alert(
        'Invalid email or password. Please check both fields have been correctly entered, or sign up for a new account'
      );
    }
  }, [form]);

  return (
    <Screen>
      <div className={classes.root}>
        <div className={classes.base}>
          <br />
          <Title className={classes.title}>log in</Title>
          {/* <form onSubmit={form.onSubmit(() => navigate('/home'))} className={classes.form}> */}
          <form
            onSubmit={form.onSubmit((values) => {
              console.log('onSubmit', { values });
              handleSubmit();
            })}
            className={classes.form}
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
              }}
              label="password"
              placeholder="password-123"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />

            {/* form submission */}
            <Group justify="center" mt="md">
              <Button className={classes.submit} type="submit">
                submit
              </Button>
            </Group>
          </form>

          {/* Sign up link */}
          <br />
          <br />
          <Group gap={8} justify="center">
            <Text size="sm">no account? </Text>
            <Text
              className={classes.signupText}
              size="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
              td="underline"
            >
              sign up
            </Text>
          </Group>
        </div>
      </div>
    </Screen>
  );
};
