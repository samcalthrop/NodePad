import classes from './EditNodeMetaScreen.module.css';
import { ScreenWithSidebar } from '../ScreenWithSidebar';
import { useNavigate } from 'react-router-dom';
import { Button, Title } from '@mantine/core';
import { MDXEditor } from '@mdxeditor/editor';
import { headingsPlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useEffect, useState } from 'react';

export const EditNodeMetaScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const path = './README.md';

  // test
  const [fileContents, setFileContents] = useState<string>();
  // retrieving the file contents from the backend
  useEffect(() => {
    window.ipcAPI.getFileContents(path).then((fileContents) => {
      setFileContents(fileContents);
    });
  }, []);

  return (
    <ScreenWithSidebar>
      <div className={classes.root}>
        <div className={classes.thing}>
          <Title order={2}>Edit node meta</Title>

          <MDXEditor markdown={fileContents ? fileContents : ''} plugins={[headingsPlugin()]} />

          <Button variant="subtle" className={classes.button} onClick={() => navigate('/home')}>
            Exit
          </Button>
        </div>
      </div>
    </ScreenWithSidebar>
  );
};
