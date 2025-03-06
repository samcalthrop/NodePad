import classes from './EditNodeMetaScreen.module.css';
import {
  Combobox,
  Divider,
  Group,
  Pill,
  PillsInput,
  ScrollArea,
  Space,
  Title,
  useCombobox,
  Highlight,
} from '@mantine/core';
import {
  MDXEditor,
  MDXEditorMethods,
  codeBlockPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
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
import { useSharedData } from '../../providers/SharedDataProvider';
import { useThrottledCallback } from '@mantine/hooks';
import { IconHash } from '@tabler/icons-react';

export const EditNodeMetaScreen = (): JSX.Element => {
  // the file selected in the sidebar
  const {
    selectedTreeNodeData,
    setSelectedTreeNodeData,
    selectedFile,
    setTitle,
    saveFrequency,
    newFileCreated,
  } = useSharedData();
  // uses a react state to get/ change the current contents of the file being edited
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  // uses a react state to get/ change the current contents of the file being edited
  const [fileContents, setFileContents] = useState<string | null>(null);

  // ----------------------------

  const tags: Array<string> = [
    'maths',
    'english',
    'computer science',
    'sciences',
    'physics',
    'english literature',
    'psychology',
  ];
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<Array<string>>([]);

  const combobox = useCombobox({
    onDropdownClose: (): void => combobox.resetSelectedOption(),
    onDropdownOpen: (): void => combobox.updateSelectedOptionIndex('active'),
  });

  const handleValueSelect = (val: string): void => {
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );
    combobox.closeDropdown();
  };

  const handleValueRemove = (val: string): void => {
    setValue((current) => current.filter((v) => v !== val));
  };

  const values = value.map((item) => (
    <Pill
      className={classes.pill}
      size="md"
      key={item}
      withRemoveButton
      onRemove={() => handleValueRemove(item)}
    >
      {item}
    </Pill>
  ));

  const options = tags
    .filter(
      (item) =>
        !value.includes(item) && // exclude already selected tags
        item.toLowerCase().includes(search.trim().toLowerCase())
    )
    .map((item) => (
      <Combobox.Option value={item} key={item}>
        <Group gap="4" className={classes.tagsDropdownGroup}>
          <span>#</span>
          <Highlight highlight={search} color="#bca0d9">
            {item}
          </Highlight>
        </Group>
      </Combobox.Option>
    ));

  useEffect(() => {
    // we need to wait for options to render before we can select first one
    if (search !== '') combobox.selectFirstOption();
  }, [search]);

  // -----------------------------

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
      // await the contents being set before auto-focusing the content
      setTimeout(() => {
        mdxEditorRef.current?.focus();
      }, 0);
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

  const getSaveDelay = (frequency: string): number => {
    if (frequency === 'on-change') return 0;
    return parseInt(frequency) || 2000;
  };

  // prevents file from being saved more than every n milliseconds
  const throttledSaveHandler = useThrottledCallback(
    handleSaveContent,
    getSaveDelay(saveFrequency || '2000')
  );

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
          <Title h={1}>no selection made yet</Title>
        ) : (
          <ScrollArea.Autosize
            className={classes.scrollableArea}
            type="never"
            offsetScrollbars
            viewportProps={{ style: { overflowX: 'hidden' } }}
            scrollHideDelay={100}
          >
            <Space className={classes.space} />
            <div
              autoFocus={newFileCreated}
              className={classes.title}
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
              spellCheck={false}
            >
              {selectedFile}
            </div>

            <div className={classes.tagsDiv}>
              <Divider className={classes.divider} size="sm" />
              <Space h="md" />
              <Combobox
                classNames={{
                  dropdown: classes.tagsDropdown,
                  option: classes.tagsOption,
                  empty: classes.tagsDropdownEmpty,
                }}
                store={combobox}
                onOptionSubmit={handleValueSelect}
              >
                <Combobox.DropdownTarget>
                  <PillsInput
                    leftSection={<IconHash color="var(--mantine-color-defaultScheme-3" />}
                    variant="unstyled"
                    onClick={() => combobox.openDropdown()}
                  >
                    <Pill.Group>
                      {values}

                      <Combobox.EventsTarget>
                        <PillsInput.Field
                          className={classes.pillsInputField}
                          onFocus={() => combobox.openDropdown()}
                          onBlur={() => combobox.closeDropdown()}
                          value={search}
                          placeholder="..."
                          onChange={(event) => {
                            combobox.updateSelectedOptionIndex();
                            setSearch(event.currentTarget.value);
                            combobox.openDropdown();
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Backspace' && search.length === 0) {
                              event.preventDefault();
                              handleValueRemove(value[value.length - 1]);
                            }
                            if (event.key === 'Enter') {
                              // if (value.length === 0) {
                              //   setTags([...tags, search]);
                              // }
                              setSearch('');
                            }
                          }}
                        />
                      </Combobox.EventsTarget>
                    </Pill.Group>
                  </PillsInput>
                </Combobox.DropdownTarget>

                <Combobox.Dropdown>
                  <Combobox.Options>
                    {options.length > 0 ? (
                      options
                    ) : (
                      <Combobox.Empty>nothing to see here</Combobox.Empty>
                    )}
                  </Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            </div>

            <div className={classes.mdxeditor}>
              {/* a class specially for the markdown editor instance, as specified in the documentation for MDXEditor: https://mdxeditor.dev/editor/docs/theming */}
              <MDXEditor
                placeholder="start typing..."
                ref={mdxEditorRef}
                className={classes.editor}
                markdown={fileContents}
                onChange={throttledSaveHandler}
                autoFocus={newFileCreated}
                contentEditableClassName={classes.contentEditable}
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
                  frontmatterPlugin(),
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
