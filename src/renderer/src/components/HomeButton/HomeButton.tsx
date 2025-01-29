import { Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export const HomeButton = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Button title="Home" variant="default" onClick={() => navigate('/home/view')}>
      <IconHome />
    </Button>
  );
};
