import { Button, Divider, Slider, Stack, Text } from '@mantine/core';
import classes from './BoidsMenu.module.css';
import { useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { PhysicsControlsProps } from '../../types';
import { useSharedData } from '../../providers/SharedDataProvider';

export const PhysicsControls = ({
  protectedRange,
  visualRange,
  avoidFactor,
  turnFactor,
  centeringFactor,
  matchingFactor,
  maxSpeed,
  nodeRadius,
  onUpdate,
}: PhysicsControlsProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const { titleOpacity, setTitleOpacity } = useSharedData();

  const minProtectedRange = 15;
  const maxProtectedRange = 200;
  const minVisualRange = maxProtectedRange;
  const maxVisualRange = 800;
  const minAvoidFactor = 0;
  const maxAvoidFactor = 0.1;
  const minTurnFactor = 0;
  const maxTurnFactor = 1;
  const minCenteringFactor = 0;
  const maxCenteringFactor = 0.001;
  const minMatchingFactor = 0;
  const maxMatchingFactor = 0.2;
  const minMaxSpeed = 0.01;
  const maxMaxSpeed = 5;
  const minNodeRadius = 10;
  const maxNodeRadius = 20;
  const minTitleOpacity = 0;
  const maxTitleOpacity = 1;

  return (
    <div className={classes.controls}>
      <Button
        justify="center"
        leftSection={isOpen ? <></> : <IconChevronRight size={16} />}
        onClick={() => setIsOpen(!isOpen)}
        className={classes.button}
        radius="lg"
      >
        controls
      </Button>

      {isOpen && (
        <Stack className={classes.content}>
          <Divider size="sm" className={classes.divider} />
          <div>
            <Text size="sm">protected range</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                trackContainer: classes.sliderTrackContainer,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={protectedRange}
              onChange={(value) => onUpdate('protectedRange', value)}
              min={minProtectedRange}
              max={maxProtectedRange}
            />
          </div>
          <div>
            <Text size="sm">visual range</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={visualRange}
              onChange={(value) => onUpdate('visualRange', value)}
              min={minVisualRange}
              max={maxVisualRange}
            />
          </div>
          <div>
            <Text size="sm">avoid factor</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={avoidFactor}
              onChange={(value) => onUpdate('avoidFactor', value)}
              min={minAvoidFactor}
              max={maxAvoidFactor}
              step={0.0001}
            />
          </div>
          <div>
            <Text size="sm">turn factor</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={turnFactor}
              onChange={(value) => onUpdate('turnFactor', value)}
              min={minTurnFactor}
              max={maxTurnFactor}
              step={0.01}
            />
          </div>
          <div>
            <Text size="sm">centering factor</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={centeringFactor}
              onChange={(value) => onUpdate('centeringFactor', value)}
              min={minCenteringFactor}
              max={maxCenteringFactor}
              step={0.00001}
            />
          </div>
          <div>
            <Text size="sm">matching factor</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={matchingFactor}
              onChange={(value) => onUpdate('matchingFactor', value)}
              min={minMatchingFactor}
              max={maxMatchingFactor}
              step={0.01}
            />
          </div>
          <div>
            <Text size="sm">max speed</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={maxSpeed}
              onChange={(value) => onUpdate('maxSpeed', value)}
              min={minMaxSpeed}
              max={maxMaxSpeed}
              step={0.01}
            />
          </div>
          <Divider size="sm" className={classes.divider} />
          <div>
            <Text size="sm">node size</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={nodeRadius}
              onChange={(value) => onUpdate('nodeRadius', value)}
              min={minNodeRadius}
              max={maxNodeRadius}
              step={1}
            />
          </div>
          <div>
            <Text size="sm">title opacity</Text>
            <Slider
              classNames={{
                root: classes.sliderRoot,
                track: classes.sliderTrack,
                bar: classes.sliderBar,
                thumb: classes.sliderThumb,
                mark: classes.sliderMark,
                markLabel: classes.sliderMarkLabel,
              }}
              label={null}
              value={titleOpacity}
              onChange={(value) => setTitleOpacity(value)}
              min={minTitleOpacity}
              max={maxTitleOpacity}
              step={0.01}
              defaultValue={0.38}
            />
          </div>
        </Stack>
      )}
    </div>
  );
};
