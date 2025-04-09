import classes from './SettingsModal.module.css';
import { Modal, Button, Tabs, Divider, Title, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import { Account } from './Account';
import { Appearance } from './Appearance';
import { Files } from './Files';
import { Help } from './Help';

export const SettingsModal = (): JSX.Element => {
  // react state used to globally keep track of if settings is open
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {/* the skeleton of the pop-over page */}
      <Modal.Root
        className={classes.modal}
        opened={opened}
        onClose={close}
        centered
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'normal',
          },
        }}
      >
        {/* the behaviour of the background when settings is open */}
        <Modal.Overlay backgroundOpacity={0.2} blur={1.8} />
        {/* the content to be displayed within the pop-over */}
        <Modal.Content radius="13px" className={classes.content}>
          {/* the 'sidebar' where the menu of settings will be displayed */}
          <NavBar />
        </Modal.Content>
      </Modal.Root>

      {/* the button that will appear in the toolbar */}
      <Button className={classes.settingsButton} variant="default" onClick={open}>
        <IconSettings size={32} />
      </Button>
    </>
  );
};

const NavBar = (): JSX.Element => {
  const [section, setSection] = useState<string>('appearance');

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Title className={classes.title}>settings</Title>
        <Title className={classes.section}>{section}</Title>
        <Modal.CloseButton className={classes.close} size="xl" />
      </div>
      <div className={classes.dividerContainer}>
        <div className={classes.behindDividerNavBar}>
          <Divider size="sm" className={classes.dividerNavBar} />
        </div>
        <div className={classes.behindDividerContentArea}>
          <Divider size="sm" className={classes.dividerContentArea} />
        </div>
      </div>
      <Tabs
        className={classes.tabs}
        color="var(--mantine-color-defaultScheme-2)"
        defaultValue="appearance"
        variant="pills"
        orientation="vertical"
        radius={0}
        onChange={(value) => setSection(value || 'appearance')}
      >
        <Tabs.List className={classes.navbar}>
          <Tabs.Tab className={classes.tab} value="appearance">
            appearance
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="account">
            account
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="files">
            files
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="help">
            help
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel className={classes.panel} value="files" onClick={() => setSection('files')}>
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Files /> {/* imported from Files.tsx */}
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel
          className={classes.panel}
          value="appearance"
          onClick={() => setSection('appearance')}
        >
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Appearance /> {/* imported from Appearance.tsx */}
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel className={classes.panel} value="account" onClick={() => setSection('account')}>
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Account /> {/* imported from Account.tsx */}
          </ScrollArea.Autosize>
        </Tabs.Panel>

        <Tabs.Panel className={classes.panel} value="help" onClick={() => setSection('help')}>
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            scrollHideDelay={100}
          >
            <Help /> {/* imported from Help.tsx */}
          </ScrollArea.Autosize>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
