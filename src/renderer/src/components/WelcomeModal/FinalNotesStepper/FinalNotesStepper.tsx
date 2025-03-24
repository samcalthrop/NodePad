import { Space, Title, Text, Group } from '@mantine/core';
import classes from './FinalNotesStepper.module.css';
import { useNavigate } from 'react-router-dom';

export const FinalNotesStepper = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className={classes.stepperContent}>
      <div className={classes.stepperTitle}>
        <Title order={3} className={classes.title}>
          thank you for choosing nodepad!
        </Title>
      </div>
      <Space h="md" />
      <div className={classes.stepperContent}>
        <Text className={classes.text}>
          If you&apos;re entirely new, or just want a refresher, we recommend heading to:
        </Text>
        <Space h="md" />
        <Text className={classes.text}> settings → files → source folder </Text>
        <Space h="md" />
        <Text className={classes.text}>to get you up to speed.</Text>

        <Group gap={8} justify="center">
          <Text className={classes.text} size="sm">
            otherwise,{' '}
          </Text>
          <Text
            className={classes.link}
            size="sm"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/home')}
            td="underline"
          >
            start taking notes!
          </Text>
        </Group>
        <Space h="md" />
      </div>
    </div>
  );
};
