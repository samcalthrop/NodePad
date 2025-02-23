import { createContext, useContext, useMemo, useState } from 'react';
import { TreeNodeData } from '@mantine/core';
import { UserCredential } from '@renderer/types';

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
