import classes from './Screen.module.css';
import { ReactNode } from 'react';

export type ScreenProps = {
  children: ReactNode;
};

export const Screen = ({ children }: ScreenProps): JSX.Element => {
  return <div className={classes.root}>{children}</div>;
};
