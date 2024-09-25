import classes from './LoginScreen.module.css';
import { Screen } from '../Screen';
import { useNavigate } from 'react-router-dom';
import { Button, Title, TextInput, Checkbox, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
// import { electronAPI } from '@electron-toolkit/preload';

export const LoginScreen = (): JSX.Element => {
  const navigate = useNavigate();

  // test
  const [fileContents, setFileContents] = useState<string>();
  // retrieving the file contents from the backend
  useEffect(() => {
    window.ipcAPI.getFileContents().then((fileContents) => {
      setFileContents(fileContents);
    });
  }, []);

  // defining the rules for the login form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },

    // in-browser validation of email entry
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Invalid password'),
    },
  });

  return (
    <Screen>
      <div className={classes.root}>
        <br />
        <Title order={1}>Log In</Title>
        <br />
        <form onSubmit={form.onSubmit(() => navigate('/home'))}>
          {/* username field */}
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          {/* password field */}
          <PasswordInput
            withAsterisk
            label="Password"
            description="ensure password length is at least 8 characters long"
            placeholder="password-123"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          {/* 'remember me' checkbox */}
          <Checkbox
            mt="sm"
            label="remember me"
            key={form.key('remember')}
            {...form.getInputProps('remember', { type: 'checkbox' })}
          />

          {/* form submission */}
          <Group justify="flex-begin" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>

        {/* Sign up link */}
        <Button
          variant="transparent"
          className={classes.button}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>

        {/* test */}
        <Button
          variant="transparent"
          className={classes.button}
          onClick={() => (fileContents ? console.log(fileContents) : console.log('failure'))}
        >
          Get file contents
        </Button>
      </div>
    </Screen>
  );
};
