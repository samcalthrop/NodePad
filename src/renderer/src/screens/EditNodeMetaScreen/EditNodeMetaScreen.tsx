import classes from './EditNodeMetaScreen.module.css';
import { ScrollArea, Space, Title } from '@mantine/core';
import {
  MDXEditor,
  MDXEditorMethods,
  codeBlockPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useEffect, useRef, useState } from 'react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';

export const EditNodeMetaScreen = (): JSX.Element => {
  // the file selected in the sidebar
  const { selectedTreeNodeData } = useSharedData();
  // uses a react state to get/ change the current contents of the file being edited
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  // uses a react state to get/ change the current contents of the file being edited
  const [fileContents, setFileContents] = useState<string | null>(null);

  useEffect(() => {
    console.log('EditNodeMetaScreen selectedTreeNodeData:', selectedTreeNodeData);
    if (!selectedTreeNodeData) {
      return;
    }

    window.ipcAPI.getFileContents(`./${selectedTreeNodeData.value}`).then((fileContents) => {
      console.log('EditNodeMetaScreen getFileContents:', fileContents);
      // setting the markdown of the editor to the file contents
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
        {fileContents === null ? (
          <div>No selection made yet</div>
        ) : (
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            offsetScrollbars
            viewportProps={{ style: { overflowX: 'hidden' } }}
            scrollHideDelay={100}
          >
            <Space h="xl" />
            <Title order={1}>Edit node meta</Title>
            <div className={classes.mdxeditor}>
              {/* a class specially for the markdown editor instance, as specified in the documentation for MDXEditor: https://mdxeditor.dev/editor/docs/theming */}
              <MDXEditor
                ref={mdxEditorRef}
                className="dark-theme dark-editor"
                markdown={fileContents}
                plugins={[
                  codeBlockPlugin(),
                  diffSourcePlugin(),
                  headingsPlugin(),
                  imagePlugin(),
                  jsxPlugin(),
                  linkDialogPlugin(),
                  linkPlugin(),
                  listsPlugin(),
                  markdownShortcutPlugin(),
                  quotePlugin(),
                  tablePlugin(),
                  // toolbarPlugin({
                  //   toolbarContents: () => (
                  //     <DiffSourceToggleWrapper>
                  //       <BlockTypeSelect />
                  //       <BoldItalicUnderlineToggles />
                  //       <StrikeThroughSupSubToggles />
                  //       <CreateLink />
                  //       <InsertImage />
                  //       <InsertTable />
                  //       <ListsToggle />
                  //       <CodeToggle />
                  //       <UndoRedo />
                  //     </DiffSourceToggleWrapper>
                  //   ),
                  // }),
                ]}
              />
            </div>
          </ScrollArea.Autosize>
        )}
      </div>
    </div>
  );
};
