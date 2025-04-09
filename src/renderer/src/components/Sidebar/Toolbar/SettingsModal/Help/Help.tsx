import classes from './Help.module.css';
import { Text, Stack, Divider, Space, Title, Image } from '@mantine/core';
import demo1 from '@resources/settings-help/demo1.gif';
import demo2 from '@resources/settings-help/demo2.gif';
import demo3 from '@resources/settings-help/demo3.gif';
import demo4 from '@resources/settings-help/demo4.gif';
import demo5 from '@resources/settings-help/demo5.gif';
import demo6 from '@resources/settings-help/demo6.gif';

export const Help = (): JSX.Element => {
  return (
    <Stack className={classes.stack}>
      <div className={classes.settingComponent}>
        <Title className={classes.settingsSubHeading} size="h2">
          getting started
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>
            welcome to nodepad! if it&apos;s your first time here, there are some basics to cover:
            firstly, nodepad is a note-taking app that uses live markdown rendering to make your
            notes look pretty as you write them. if you aren&apos;t familiar with markdown syntax, a
            good place to start would be{' '}
            <a className={classes.link} href="https://www.markdownguide.org/getting-started/">
              this introduction and tutorial
            </a>
            .
          </Text>
          <Space h="md" />
          <Text className={classes.text}>
            nodepad stores your notes as <em>nodes</em>, hence the name. these are stored both in
            the sidebar on the left, and visually as <em>nodes</em>. they can be dragged and
            collided, but their most important function is to act as a visual representation of how
            your notes relate: you can connect notes that are related together
          </Text>
        </div>

        <Title className={classes.settingsComponentTitle} size="h3">
          accessing your notes
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>
            in order to get started, you need a root directory to store your notes in. to do this,
            you can select a directory through:
          </Text>
          <Space h="md" />
          <Text className={classes.text}> settings → files → source folder </Text>
          <Space h="md" />
          <Text className={classes.text}>
            {' '}
            if you don&apos;t have a directory for your notes, you can make one first <br /> in your
            file system before doing this{' '}
          </Text>
          <Space h="md" />
          <Image
            radius="md"
            src={demo1}
            alt="navigating to the select directory setting"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            className={classes.demo}
          />
          <Space h="md" />
          <Text className={classes.text}>
            then, to open a note, you can left click on its name in the sidebar, or right click on
            it in the node network:
          </Text>
          <Space h="md" />
          <Image
            radius="md"
            src={demo6}
            alt="opening a note"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            className={classes.demo}
          />
          <Space h="md" />
          <Text className={classes.text}>
            furthermore, to create a new note, you can either click on the `+` icon at the bottom of
            the sidebar, or press `cmd`+`n` (mac) or `ctrl`+`n` (windows/ linux):
          </Text>
          <Space h="md" />
          <Image
            radius="md"
            src={demo5}
            alt="creating a new note"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            className={classes.demo}
          />
        </div>
      </div>

      <Divider size="sm" className={classes.dividerSettingsComponent} />

      <div className={classes.settingComponent}>
        <Title className={classes.settingsSubHeading} size="h2">
          network behaviour
        </Title>
        <Title className={classes.settingsComponentTitle} size="h3">
          boid&apos;s algorithm
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>
            you may have noticed that the network starts moving on its own if you remain idle for 5
            seconds. this behaviour is known as boid&apos;s algorithm, which mimics the flocking of
            birds on your notes. if you don&apos;t want your notes moving around as such, you can
            toggle the behaviour by following:
          </Text>
          <Space h="md" />
          <Text className={classes.text}> settings → appearance → boid&apos;s algorithm </Text>
          <Space h="md" />
          <Image
            radius="md"
            src={demo2}
            alt="toggling boid's algorithm"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            className={classes.demo}
          />
          <Space h="md" />
          <Text className={classes.text}>
            if you&apos;d prefer to keep the behaviour, but aren&apos;t happy with the way the nodes
            are interacting, you can change the parameters for boid&apos;s algorithm by using the
            drop down menu in the top right of the network - this will be more understandable for
            those who have an understanding of boid&apos;s. therefore, an explanation of each
            parameter is also below:
          </Text>
          <Space h="md" />
          <Text className={classes.text}>
            <ul>
              <li>
                <b>protected range</b> - the circle around each node, within which the nodes do not
                &apos;see&apos; or follow one another.{' '}
                <em>the larger the value, the further apart nodes have to be to flock</em>
              </li>
              <li>
                <b>visual range</b> - a larger circle around each node, within which the nodes can
                &apos;see&apos; other nodes, which can then have the flocking behaviour applied to
                it.{' '}
                <em>
                  the larger the value, the further each node can see (and hence gravitate towards)
                </em>
              </li>
              <li>
                <b>avoid factor</b> - a factor determining how strongly/ &apos;urgently&apos; the
                nodes move away from one another, or the edges of the network.{' '}
                <em>the greater the value, the harder the nodes try to get escape each other</em>
              </li>
              <li>
                <b>turn factor</b> - a factor determining how strong the tendency of the flock is to
                turn from its path. <em>the greater the value, the more the flock turns/ sweeps</em>
              </li>
              <li>
                <b>centering factor</b> - a factor determining each node in a flock&apos;s tendency
                to move towards the centre of the flock.{' '}
                <em>the higher the value, the more strongly the nodes tend towards the centre</em>
              </li>
              <li>
                <b>matching factor</b> - a factor determining how closely each node mimics the
                movement of each other node.{' '}
                <em>
                  the higher the number, the less &apos;independently&apos; each node acts (acting
                  more like one entity)
                </em>
              </li>
              <li>
                <b>max speed</b> - the maximum speed each node can travel at.
                <em>the higher the number, the faster each node&apos;s top speed</em>
              </li>
            </ul>
          </Text>
          <Space h="md" />
          <Image
            radius="md"
            src={demo3}
            alt="toggling boid's algorithm"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            className={classes.demo}
          />
        </div>
      </div>

      <Divider size="sm" className={classes.dividerSettingsComponent} />

      <div className={classes.settingComponent}>
        <Title className={classes.settingsComponentTitle} size="h3">
          view + edit modes
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>
            in order to draw/ remove connections between nodes, toggle to edit mode (
            <em>the pencil icon</em>). you can then drag a connection from the smaller circle within
            a node to another&apos;s. to remove a connection, simply left click on the connection:
          </Text>
          <Space h="md" />
          <Image
            radius="md"
            src={demo4}
            alt="navigating to the select directory setting"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            className={classes.demo}
          />
        </div>
      </div>

      <Space h="md" />
    </Stack>
  );
};
