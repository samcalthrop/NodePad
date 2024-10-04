import classes from './EditNodeMetaScreen.module.css';
import { ScreenWithSidebar } from '../ScreenWithSidebar';
import { useNavigate } from 'react-router-dom';
import { Button, Title } from '@mantine/core';
import { MDXEditor, MDXEditorMethods, codeBlockPlugin, headingsPlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useEffect, useRef, useState } from 'react';

export const EditNodeMetaScreen = (): JSX.Element => {
  const navigate = useNavigate();
  // uses a react state to get/ change the current contents of the file being edited
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  // hard-coded path to the README in order to retrieve test data from the backend
  const path = './README.md';

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

          {/* a class specially for the markdown editor instance, as specified in the documentation for MDXEditor: https://mdxeditor.dev/editor/docs/theming */}
          <div className={classes.mdxeditor}>
            <MDXEditor
              ref={mdxEditorRef}
              className="dark-theme dark-editor"
              markdown={fileContents ?? '# Failed to retrieve contents'}
              plugins={[codeBlockPlugin(), headingsPlugin()]}
            />
          </div>

          <Button variant="subtle" className={classes.button} onClick={() => navigate('/home')}>
            Exit
          </Button>
        </div>
      </div>
    </ScreenWithSidebar>
  );
};
