import classes from './EditNodeMetaScreen.module.css';
import { ScreenWithSidebar } from '../ScreenWithSidebar';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text } from '@mantine/core';

export const EditNodeMetaScreen = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <ScreenWithSidebar>
      <div className={classes.root}>
        <div className={classes.thing}>
          <Title order={2}>Edit node meta</Title>
          <Text>Exit</Text>
          <Button variant="subtle" className={classes.button} onClick={() => navigate('/home')}>
            Ok
          </Button>
        </div>
      </div>
    </ScreenWithSidebar>
  );
};
