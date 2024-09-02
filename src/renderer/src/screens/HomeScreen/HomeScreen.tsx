import classes from './HomeScreen.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text } from '@mantine/core';
import { ScreenWithSidebar } from '../ScreenWithSidebar';
import { Canvas } from '@renderer/components/Canvas';
import { drawPulsingDot } from '@renderer/drawing/drawPulsingDot';

export const HomeScreen = (): JSX.Element => {
  const navigate = useNavigate();

  window.electron.ipcRenderer.send('ping', 'this is an arg');

  return (
    <ScreenWithSidebar>
      <div className={classes.root}>
        <div className={classes.thing}>
          <Title order={1}>Home</Title>
          <Canvas drawFunc={drawPulsingDot} width={200} height={200} />
          <Text>Edit node meta</Text>
          <Button
            variant="subtle"
            className={classes.button}
            onClick={() => navigate('/edit-node-meta')}
          >
            Ok
          </Button>
          <br />

          {/*  */}

          <Button
            variant="filled"
            className={classes.button}
            onClick={() => window.electron.ipcRenderer.send('send-data', 'argument')}
          >
            Make thing happen
          </Button>

          {/*  */}
        </div>
      </div>
    </ScreenWithSidebar>
  );
};
