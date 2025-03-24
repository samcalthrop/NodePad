import { createContext, useContext, useMemo, useState } from 'react';
import { MantineColorScheme, TreeNodeData } from '@mantine/core';
import { UserCredential } from '../../types';

export type SharedDataProviderProps = {
  children: React.ReactNode;
};

export type SharedData = {
  selectedTreeNodeData: TreeNodeData | undefined;
  setSelectedTreeNodeData: React.Dispatch<React.SetStateAction<TreeNodeData | undefined>>;
  credentials: UserCredential | undefined;
  setCredentials: React.Dispatch<React.SetStateAction<UserCredential | undefined>>;
  rootDirPath: string | undefined;
  setRootDirPath: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedFile: string | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  title: string | undefined;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  boids: boolean | undefined;
  setBoids: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  nodeRadius: number | undefined;
  setNodeRadius: React.Dispatch<React.SetStateAction<number | undefined>>;
  titleOpacity: number | undefined;
  setTitleOpacity: React.Dispatch<React.SetStateAction<number | undefined>>;
  email: string | undefined;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
  username: string | undefined;
  setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
  password: string | undefined;
  setPassword: React.Dispatch<React.SetStateAction<string | undefined>>;
  saveFrequency: string | undefined;
  setSaveFrequency: React.Dispatch<React.SetStateAction<string | undefined>>;
  counter: number | undefined;
  setCounter: React.Dispatch<React.SetStateAction<number | undefined>>;
  newFileCreated: boolean | undefined; // decides whether to autofocus content or title of file (new file -> title, file exists -> content)
  setNewFileCreated: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  fileTags: Array<string> | undefined; // the tags associated with a file
  setFileTags: React.Dispatch<React.SetStateAction<Array<string>>>;
  globalTags: Array<string> | undefined; // the tags associated with any file in the root directory
  setGlobalTags: React.Dispatch<React.SetStateAction<Array<string>>>;
  tagOptions: Array<string> | undefined; // the tags the user can select for a file (not already selected)
  setTagOptions: React.Dispatch<React.SetStateAction<Array<string>>>;
  isNewUser: boolean | undefined; // the tags the user can select for a file (not already selected)
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  uiMode: MantineColorScheme | undefined; // the mode the user's UI is in (light or dark mode). affects colour schemes
  setUiMode: React.Dispatch<React.SetStateAction<MantineColorScheme | undefined>>;
};

export const SharedDataContext = createContext<SharedData | undefined>(undefined);

export function SharedDataProvider({ children }: SharedDataProviderProps): JSX.Element {
  const [selectedTreeNodeData, setSelectedTreeNodeData] = useState<TreeNodeData>();
  const [credentials, setCredentials] = useState<UserCredential>();
  const [rootDirPath, setRootDirPath] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [boids, setBoids] = useState<boolean>();
  const [nodeRadius, setNodeRadius] = useState<number>();
  const [titleOpacity, setTitleOpacity] = useState<number>();
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [saveFrequency, setSaveFrequency] = useState<string>();
  const [counter, setCounter] = useState<number>();
  const [newFileCreated, setNewFileCreated] = useState<boolean>();
  const [fileTags, setFileTags] = useState<Array<string>>([]);
  const [globalTags, setGlobalTags] = useState<Array<string>>([]);
  const [tagOptions, setTagOptions] = useState<Array<string>>([]);
  const [isNewUser, setIsNewUser] = useState<boolean>();
  const [uiMode, setUiMode] = useState<MantineColorScheme>();

  const value = useMemo<SharedData>(
    () => ({
      selectedTreeNodeData,
      setSelectedTreeNodeData,
      credentials,
      setCredentials,
      rootDirPath,
      setRootDirPath,
      selectedFile,
      setSelectedFile,
      title,
      setTitle,
      boids,
      setBoids,
      nodeRadius,
      setNodeRadius,
      titleOpacity,
      setTitleOpacity,
      email,
      setEmail,
      username,
      setUsername,
      password,
      setPassword,
      saveFrequency,
      setSaveFrequency,
      counter,
      setCounter,
      newFileCreated,
      setNewFileCreated,
      fileTags,
      setFileTags,
      globalTags,
      setGlobalTags,
      tagOptions,
      setTagOptions,
      isNewUser,
      setIsNewUser,
      uiMode,
      setUiMode,
    }),
    [
      selectedTreeNodeData,
      credentials,
      rootDirPath,
      selectedFile,
      title,
      boids,
      nodeRadius,
      titleOpacity,
      email,
      username,
      password,
      saveFrequency,
      counter,
      newFileCreated,
      fileTags,
      globalTags,
      tagOptions,
      isNewUser,
      uiMode,
    ]
  );

  return <SharedDataContext.Provider value={value}>{children}</SharedDataContext.Provider>;
}

export const useSharedData = (): SharedData => {
  const sharedData = useContext(SharedDataContext);
  if (sharedData === undefined) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }

  return sharedData;
};
