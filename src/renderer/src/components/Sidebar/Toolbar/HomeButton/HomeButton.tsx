import { Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import classes from './HomeButton.module.css';

export const HomeButton = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Button
      className={classes.homeButton}
      title="Home"
      variant="default"
      onClick={() => navigate('/home/view')}
    >
      <IconHome size={32} />
    </Button>
  );
};
