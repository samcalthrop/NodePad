import classes from './HomeViewScreen.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text } from '@mantine/core';
import { Canvas } from '@renderer/components/Canvas';
import { drawPulsingDot } from '@renderer/drawing/drawPulsingDot';
// import { Center, SegmentedControl, rem } from '@mantine/core';
// import { IconEye, IconPencil } from '@tabler/icons-react';

export const HomeViewScreen = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <div className={classes.thing}>
        <Title order={2}>Home</Title>
        {/* <SegmentedControl
            data={[
              {
                value: 'preview',
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconEye style={{ width: rem(16), height: rem(16) }} />
                  </Center>
                ),
              },
              {
                value: 'edit',
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconPencil style={{ width: rem(16), height: rem(16) }} />
                  </Center>
                ),
              },
            ]}
            radius="lg"
          /> */}
        <Canvas drawFunc={drawPulsingDot} width={200} height={200} />
        <Text>Edit node meta</Text>
        <Button
          variant="subtle"
          className={classes.button}
          onClick={() => navigate('../edit-node-meta')}
        >
          Ok
        </Button>
      </div>
    </div>
  );
};
