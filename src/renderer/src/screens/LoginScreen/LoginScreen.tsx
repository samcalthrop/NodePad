import classes from './LoginScreen.module.css';
import { Screen } from '../Screen';
import { useNavigate } from 'react-router-dom';
import { Button, Title, TextInput, Checkbox, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
// import { electronAPI } from '@electron-toolkit/preload';

export const LoginScreen = (): JSX.Element => {
  const navigate = useNavigate();

  // defining the rules for the login form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      remember: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Screen>
      <div className={classes.root}>
        <Title order={2}>Log in</Title>
        <br />
        <form onSubmit={form.onSubmit(() => navigate('/home'))}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <Checkbox
            mt="sm"
            label="remember me"
            key={form.key('remember')}
            {...form.getInputProps('remember', { type: 'checkbox' })}
          />

          <Group justify="flex-begin" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </div>
    </Screen>
  );
};
