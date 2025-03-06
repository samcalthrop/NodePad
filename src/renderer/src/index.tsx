// import classes from './index.module.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/main.css';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { SharedDataProvider, useSharedData } from './providers/SharedDataProvider';
import { useHotkeys } from '@mantine/hooks';

const theme = createTheme({
  fontFamily: 'Fira Code, monospace',
  colors: {
    // each colour in the colour scheme can be accessed via indexing, e.g --mantine-default-scheme-5 yields purple (#61497C)
    defaultScheme: [
      '#19161E',
      '#29262D',
      '#2E2B33',
      '#4A4850',
      '#62606B',
      '#61497C',
      '#FED5FB',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
    ],
  },
  headings: {
    fontFamily: 'fredoka, sans-serif',
    fontWeight: '500',
    sizes: {
      h1: { fontSize: '54px' },
      h2: { fontSize: '40px' },
      h3: { fontSize: '30px' },
      h4: { fontSize: '24px' },
      h5: { fontSize: '22px' },
      h6: { fontSize: '20px' },
    },
  },
  fontSizes: {
    xs: '10px',
    sm: '15px',
    md: '15px',
    lg: '40px',
    xl: '54px',
  },
});

const AppWrapper = (): JSX.Element => {
  const {
    counter,
    setCounter,
    rootDirPath,
    setSelectedFile,
    setSelectedTreeNodeData,
    setNewFileCreated,
  } = useSharedData();
  const navigate = useNavigate();

  useHotkeys([
    [
      'mod+N',
      (): void => {
        if (!counter) setCounter(1);

        const fileName = 'new file ' + counter;

        // save new file
        window.ipcAPI.saveFile((rootDirPath ?? '~') + '/' + fileName + '.md', '');

        // tells text editor what file to open
        setSelectedTreeNodeData({
          label: fileName,
          value: rootDirPath + '/' + fileName + '.md',
        });
        setSelectedFile(fileName);
        // title of file will be autofocused so user can quickly rename from 'new file X'
        setNewFileCreated(true);
        console.log(`navigating to ${fileName}`);
        navigate('/home/edit-node-meta');

        // increment counter in anticipation of another file being created (prevents duplicate naming)
        setCounter((counter ?? 1) + 1);

        console.log('cmd/ctrl+n: create new note');
      },
    ],
    [
      'mod+,',
      (): void => {
        console.log('cmd/ctrl+,: open settings');
      },
    ],
  ]);

  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/home/*" element={<HomeScreen />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <SharedDataProvider>
        <HashRouter>
          <AppWrapper />
        </HashRouter>
      </SharedDataProvider>
    </MantineProvider>
  </React.StrictMode>
);
