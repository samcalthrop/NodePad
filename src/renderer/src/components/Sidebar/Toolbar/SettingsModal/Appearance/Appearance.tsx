import { useSharedData } from '../../../../../providers/SharedDataProvider';
import { useTheme } from '../../../../../providers/ThemeProvider';
import { ThemeModuleProps } from '../../../../../types';
import classes from './Appearance.module.css';
import { Text, Stack, Divider, Space, Title, Checkbox, Grid } from '@mantine/core';

// modularising each component of the Navbar
export const Appearance = (): JSX.Element => {
  const { boids, setBoids } = useSharedData();

  return (
    <Stack className={classes.stack}>
      <div className={classes.settingComponent}>
        <Title className={classes.settingsSubHeading} size="h2">
          network
        </Title>
        <Text className={classes.text}>determine the characteristics of the network of nodes</Text>
        <Title className={classes.settingsComponentTitle} size="h3">
          boid&apos;s algorithm
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>
            decide whether boid&apos;s algorithm is applied to the network - this essentially allows
            the nodes to move autonomously, similarly to how a flock of birds moves in the sky
          </Text>
          <Space h="md" />
          <Checkbox
            color="var(--mantine-color-defaultScheme-5)"
            classNames={{
              root: classes.checkbox,
              input: classes.checkboxInput,
            }}
            label={boids ? "boid's will run" : "boid's won't run"}
            checked={boids}
            onChange={(event) => setBoids(event.currentTarget.checked)}
            wrapperProps={{
              onClick: () => setBoids((isChecked) => !isChecked),
            }}
          />
        </div>
      </div>

      <Divider size="sm" className={classes.dividerSettingsComponent} />

      <div className={classes.settingComponent}>
        <Title className={classes.settingsSubHeading} size="h2">
          theming
        </Title>
        <Text className={classes.text}>customise how you want your app to look</Text>

        <Title className={classes.settingsComponentTitle} size="h3">
          colour theme
        </Title>
        <div className={classes.settingsComponentContent}>
          <Text className={classes.text}>tailor the app to your preference</Text>
          <Space h="md" />
          <ThemePickerGrid />
        </div>
      </div>
    </Stack>
  );
};

const ThemePickerGrid = (): JSX.Element => {
  return (
    <Grid className={classes.grid}>
      <Grid.Col span={6}>
        <ThemeModule
          themeName="defaultTheme"
          label="default"
          backgroundColour="#29262D"
          foregroundColour="#61497C"
          secondaryColour="#FED5FB"
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <ThemeModule
          themeName="lavenderTheme"
          label="lavender"
          backgroundColour="#1D1A2C"
          foregroundColour="rgb(86, 63, 95)"
          secondaryColour="#a4b6dd"
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <ThemeModule
          themeName="oceanTheme"
          label="ocean"
          backgroundColour="rgb(26, 29, 56)"
          foregroundColour="#504c8d"
          secondaryColour="#ffffff"
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <ThemeModule
          themeName="deepOceanTheme"
          label="deep ocean"
          backgroundColour="#131037"
          foregroundColour="rgb(49, 25, 134)"
          secondaryColour="#35305E"
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <ThemeModule
          themeName="lightTheme"
          label="light"
          backgroundColour="#f7f7f2f5"
          foregroundColour="#5465ff"
          secondaryColour="#B7B7B2B5"
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <ThemeModule
          themeName="magmaTheme"
          label="magma"
          backgroundColour="#1A0F0F"
          foregroundColour="#ff514a"
          secondaryColour="#ff916a"
        />
      </Grid.Col>
    </Grid>
  );
};

export const ThemeModule = ({
  themeName,
  label,
  backgroundColour,
  foregroundColour,
  secondaryColour,
}: ThemeModuleProps): JSX.Element => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={`${classes.themeBox} ${theme === themeName ? classes.theme : ''}`}
      onClick={() => setTheme(themeName)}
      style={{
        backgroundColor: backgroundColour,
        borderColor: theme === themeName ? foregroundColour : 'transparent',
      }}
    >
      <div className={classes.themeAccent} style={{ backgroundColor: foregroundColour }}></div>
      <div
        className={classes.themeAccentSecondary}
        style={{ backgroundColor: secondaryColour }}
      ></div>
      <Text c={secondaryColour} className={classes.themeLabel}>
        {label}
      </Text>
    </div>
  );
};
