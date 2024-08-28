import classes from './LoginScreen.module.css';
import { Screen } from '../Screen';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text } from '@mantine/core';

export const LoginScreen = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Screen>
      <div className={classes.root}>
        <Title order={2}>Log in</Title>
        <Text>Please enter your login credentials</Text>
        <Button className={classes.button} onClick={() => navigate('/home')}>
          Ok
        </Button>
      </div>
    </Screen>
  );
};
