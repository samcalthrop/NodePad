import classes from '../LoginScreen/LoginScreen.module.css';
import { Screen } from '../Screen';
import { useNavigate } from 'react-router-dom';
import { Button, Title, TextInput, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback } from 'react';

export const SignUpScreen = (): JSX.Element => {
  const navigate = useNavigate();

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
    const { email, password } = form.getValues();
    const result = await window.ipcAPI.createCredentials(email, password);
    if (result) {
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
        <br />
        <Title order={1}>Sign Up</Title>
        <br />
        <form
          onSubmit={form.onSubmit((values) => {
            console.log('onSubmit', { values });
            handleSubmit();
          })}
        >
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

          {/* re-enter password field */}
          <PasswordInput
            withAsterisk
            label="Re-enter Password"
            placeholder="password-123"
            key={form.key('reEnterPassword')}
            {...form.getInputProps('reEnterPassword')}
          />

          {/* form submission */}
          <Group justify="flex-begin" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </div>
    </Screen>
  );
};
