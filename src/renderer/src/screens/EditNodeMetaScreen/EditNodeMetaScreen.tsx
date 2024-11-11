import classes from './EditNodeMetaScreen.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Title } from '@mantine/core';
import { MDXEditor, MDXEditorMethods, codeBlockPlugin, headingsPlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useEffect, useRef, useState } from 'react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';

export const EditNodeMetaScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { selectedTreeNodeData } = useSharedData();
  // uses a react state to get/ change the current contents of the file being edited
  const mdxEditorRef = useRef<MDXEditorMethods>(null);

  const [fileContents, setFileContents] = useState<string | null>(null);

  useEffect(() => {
    console.log('EditNodeMetaScreen selectedTreeNodeData:', selectedTreeNodeData);
    if (!selectedTreeNodeData) {
      return;
    }

    window.ipcAPI.getFileContents(`./${selectedTreeNodeData.value}`).then((fileContents) => {
      console.log('EditNodeMetaScreen getFileContents:', fileContents);
      mdxEditorRef.current?.setMarkdown(fileContents);
      console.log(
        'EditNodeMetaScreen: mdxEditorRef.current?.getMarkdown()',
        mdxEditorRef.current?.getMarkdown()
      );
      setFileContents(fileContents);
    });
  }, [selectedTreeNodeData]);

  return (
    <div className={classes.root}>
      <div className={classes.innerDiv}>
        <Title order={2}>Edit node meta</Title>

        {fileContents === null ? (
          <div>No selection made yet</div>
        ) : (
          <div className={classes.mdxeditor}>
            {/* a class specially for the markdown editor instance, as specified in the documentation for MDXEditor: https://mdxeditor.dev/editor/docs/theming */}
            <MDXEditor
              ref={mdxEditorRef}
              className="dark-theme dark-editor"
              markdown={fileContents}
              plugins={[codeBlockPlugin(), headingsPlugin()]}
            />
          </div>
        )}

        <Button variant="subtle" className={classes.button} onClick={() => navigate('../view')}>
          Exit
        </Button>
      </div>
    </div>
  );
};
