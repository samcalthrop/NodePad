import { ReactNode } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Screen } from '../Screen';
import classes from './ScreenWithSidebar.module.css';

export type ScreenWithSidebarProps = {
  children: ReactNode;
};

export const ScreenWithSidebar = ({ children }: ScreenWithSidebarProps): JSX.Element => {
  return (
    <Screen>
      <div className={classes.root}>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
        <div>{children}</div>
      </div>
    </Screen>
  );
};
