import classes from './HomeScreen.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text } from '@mantine/core';
import { ScreenWithSidebar } from '../ScreenWithSidebar';
import { Canvas } from '@renderer/components/Canvas';
import { drawPulsingDot } from '@renderer/drawing/drawPulsingDot';

export const HomeScreen = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <ScreenWithSidebar>
      <div className={classes.root}>
        <Title order={2}>Home</Title>
        <Canvas drawFunc={drawPulsingDot} width={200} height={200} />
        <Text>Edit node meta</Text>
        <Button className={classes.button} onClick={() => navigate('/edit-node-meta')}>
          Ok
        </Button>
      </div>
    </ScreenWithSidebar>
  );
};
