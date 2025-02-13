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
};

export const SharedDataContext = createContext<SharedData | undefined>(undefined);

export function SharedDataProvider({ children }: SharedDataProviderProps): JSX.Element {
  const [selectedTreeNodeData, setSelectedTreeNodeData] = useState<TreeNodeData>();
  const [credentials, setCredentials] = useState<UserCredential>();
  const [rootDirPath, setRootDirPath] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const [title, setTitle] = useState<string>();

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
    }),
    [selectedTreeNodeData, credentials, rootDirPath, selectedFile, title]
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
