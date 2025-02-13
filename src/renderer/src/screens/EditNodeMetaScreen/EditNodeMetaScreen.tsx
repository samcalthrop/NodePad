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
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedData } from '@renderer/providers/SharedDataProvider';
// import { useForm } from '@mantine/form';
import { useThrottledCallback } from '@mantine/hooks';

export const EditNodeMetaScreen = (): JSX.Element => {
  // the file selected in the sidebar
  const { selectedTreeNodeData, setSelectedTreeNodeData, selectedFile, setTitle } = useSharedData();
  // uses a react state to get/ change the current contents of the file being edited
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  // uses a react state to get/ change the current contents of the file being edited
  const [fileContents, setFileContents] = useState<string | null>(null);

  useEffect(() => {
    console.log('EditNodeMetaScreen selectedTreeNodeData:', selectedTreeNodeData);
    if (!selectedTreeNodeData) return;

    window.ipcAPI.getFileContents(`${selectedTreeNodeData.value}`).then((fileContents) => {
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

  const handleSaveContent = useCallback(
    async (markdown: string): Promise<void> => {
      if (!selectedTreeNodeData) return;
      try {
        await window.ipcAPI.saveFile(selectedTreeNodeData.value, markdown);
        console.log('File saved successfully');
      } catch (error) {
        console.error('Error saving file:', error);
      }
    },
    [selectedTreeNodeData]
  );

  const throttledSaveHandler = useThrottledCallback(handleSaveContent, 2000);

  const handleSaveTitle = useCallback(
    async (newTitle: string): Promise<void> => {
      if (!selectedTreeNodeData) return;
      try {
        const result = await window.ipcAPI.renameFile(selectedTreeNodeData.value, newTitle);
        // update the title
        setTitle(newTitle);
        // wait one tick to ensure file system operation is complete...
        await new Promise((resolve) => setTimeout(resolve, 0));
        // ...before updating the tree node data to prevent operations occurring out of sync
        setSelectedTreeNodeData({
          ...selectedTreeNodeData,
          value: result.path,
          label: newTitle,
        });
      } catch (error) {
        console.error('Error renaming file:', error);
      }
    },
    [selectedTreeNodeData, setTitle, setSelectedTreeNodeData]
  );

  return (
    <div className={classes.root}>
      <div className={classes.innerDiv}>
        {fileContents === null ? (
          <Title h={1}>No selection made yet</Title>
        ) : (
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="scroll"
            offsetScrollbars
            viewportProps={{ style: { overflowX: 'hidden' } }}
            scrollHideDelay={100}
          >
            <Space h="xl" />
            {/* <Title order={1} contentEditable={true} onChange={titleSaveHandler}>
              {selectedFile}
            </Title> */}
            <div
              contentEditable={true}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                  handleSaveTitle(e.currentTarget.textContent || '');
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasteText = e.clipboardData.getData('text/plain').replace(/\n/g, '');
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  range.deleteContents();
                  range.insertNode(document.createTextNode(pasteText));
                  selection.collapseToEnd();
                }
              }}
              style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
              className={classes.title}
            >
              {selectedFile}
            </div>

            <div className={classes.mdxeditor}>
              {/* a class specially for the markdown editor instance, as specified in the documentation for MDXEditor: https://mdxeditor.dev/editor/docs/theming */}
              <MDXEditor
                ref={mdxEditorRef}
                // className="dark-theme dark-editor"
                className={classes.editor}
                markdown={fileContents}
                onChange={throttledSaveHandler}
                plugins={[
                  codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
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
                  thematicBreakPlugin(),
                  sandpackPlugin(),
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
