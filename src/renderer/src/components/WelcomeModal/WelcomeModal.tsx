import classes from './WelcomeModal.module.css';
import { Modal, Button as MantineButton, Stepper, Group } from '@mantine/core';
import { useSharedData } from '../../providers/SharedDataProvider';
import { useEffect, useState } from 'react';
import {
  IconArrowLeft,
  IconArrowRight,
  IconEdit,
  IconInfoCircle,
  IconNotes,
} from '@tabler/icons-react';
import { FileStepper } from './FilesStepper/FilesStepper';
import { ThemingStepper } from './ThemingStepper/ThemingStepper';
import { FinalNotesStepper } from './FinalNotesStepper/FinalNotesStepper';

export const WelcomeModal = (): JSX.Element => {
  const { isNewUser, setIsNewUser } = useSharedData();
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  useEffect(() => {
    if (isNewUser) setWelcomeModalOpen(true);
  }, [isNewUser]);

  const handleCloseWelcomeModal = (): void => {
    setWelcomeModalOpen(false);
    setIsNewUser(false);
  };

  return (
    <Modal.Root
      closeOnClickOutside={false}
      opened={welcomeModalOpen}
      onClose={handleCloseWelcomeModal}
      size="lg"
      className={classes.modal}
      centered
    >
      <Modal.Overlay backgroundOpacity={0.2} blur={1.8} />
      <Modal.Content radius="13px" className={classes.content}>
        <WelcomeStepper />
      </Modal.Content>
    </Modal.Root>
  );
};

const WelcomeStepper = (): JSX.Element => {
  const [active, setActive] = useState(0);

  const nextStep = (): void => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = (): void => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className={classes.stepperContainer}>
      <Stepper
        iconSize={45}
        active={active}
        onStepClick={setActive}
        color="var(--mantine-color-defaultScheme-6)"
        classNames={{
          root: classes.stepper,
          step: classes.step,
          stepCompletedIcon: classes.stepperCompletedIcon,
          stepIcon: classes.stepperIcon,
          stepLabel: classes.stepperLabel,
          separator: classes.stepperSeparator,
        }}
        styles={{
          stepLabel: {
            fontSize: '20px',
          },
        }}
      >
        <Stepper.Step label="files" icon={<IconNotes />}>
          <FileStepper />
        </Stepper.Step>
        <Stepper.Step label="theming" icon={<IconEdit />}>
          <ThemingStepper />
        </Stepper.Step>
        <Stepper.Step label="final note" icon={<IconInfoCircle />}>
          <FinalNotesStepper />
        </Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl" className={classes.navigationButtons}>
        <MantineButton
          variant="unstyled"
          onClick={prevStep}
          disabled={active === 0}
          className={classes.navButton}
        >
          <IconArrowLeft size={45} />
        </MantineButton>
        <MantineButton
          variant="unstyled"
          onClick={nextStep}
          disabled={active === 2}
          className={classes.navButton}
        >
          <IconArrowRight size={45} />
        </MantineButton>
      </Group>
    </div>
  );
};
