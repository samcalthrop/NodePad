import { ReactNode, useState, useCallback } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Screen } from '../Screen';
import classes from './ScreenWithSidebar.module.css';

export type ScreenWithSidebarProps = {
  children: ReactNode;
};

export const ScreenWithSidebar = ({ children }: ScreenWithSidebarProps): JSX.Element => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [resizing, setResizing] = useState(false);
  // define constraints
  const minWidth = 250;
  const maxWidth = 450;

  // function allowing the manual dynamic resizing of the sidebar
  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      setResizing(true);
      const startX = mouseDownEvent.clientX;
      const startWidth = sidebarWidth;

      const startResizing = (mouseMoveEvent: MouseEvent): void => {
        const difference = mouseMoveEvent.clientX - startX;
        const newWidth = startWidth + difference;
        if (newWidth > minWidth && newWidth < maxWidth) {
          setSidebarWidth(newWidth);
        }
      };

      const stopResizing = (): void => {
        setResizing(false);
        window.removeEventListener('mousemove', startResizing);
        window.removeEventListener('mouseup', stopResizing);
      };

      window.addEventListener('mousemove', startResizing);
      window.addEventListener('mouseup', stopResizing);
    },
    [sidebarWidth]
  ); // Add sidebarWidth to dependencies

  return (
    <Screen>
      <div className={classes.root}>
        <div
          className={classes.sidebar}
          style={{
            width: sidebarWidth,
            userSelect: 'none',
            cursor: resizing ? 'col-resize' : 'auto',
          }}
        >
          <Sidebar />
          <div className={classes.resizer} onMouseDown={startResizing} />
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    </Screen>
  );
};
