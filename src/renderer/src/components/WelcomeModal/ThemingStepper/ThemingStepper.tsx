import { Space, Title, Grid } from '@mantine/core';
import classes from './ThemingStepper.module.css';
import { ThemeModule } from '../../Sidebar/Toolbar/SettingsModal/Appearance';

export const ThemingStepper = (): JSX.Element => {
  return (
    <div className={classes.stepperContent}>
      <div className={classes.stepperTitle}>
        <Title order={3} className={classes.title}>
          please select a theme:
        </Title>
      </div>
      <Space h="md" />
      <div className={classes.stepperContent}>
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
              themeName="lightTheme"
              label="light"
              backgroundColour="#f7f7f2f5"
              foregroundColour="#5465ff"
              secondaryColour="#B7B7B2B5"
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
        </Grid>
      </div>
    </div>
  );
};
