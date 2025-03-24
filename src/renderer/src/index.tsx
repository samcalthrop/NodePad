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
import { ThemeProvider, useTheme } from './providers/ThemeProvider';

const defaultTheme = createTheme({
  fontFamily: 'Fira Code, monospace',
  focusRing: 'never',
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

const oceanTheme = createTheme({
  fontFamily: 'Fira Code, monospace',
  focusRing: 'never',
  colors: {
    defaultScheme: [
      '#19161E',
      'rgb(26, 29, 56)',
      '#202037',
      '#3A3850',
      '#42406B',
      '#213b74',
      '#504c8d',
      '#FFFFFF',
      '#FFFFFF',
      '#EAEAEA',
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

const deepOceanTheme = createTheme({
  fontFamily: 'Fira Code, monospace',
  focusRing: 'never',
  colors: {
    defaultScheme: [
      '	#03002e',
      '#131037',
      '	rgb(34, 30, 68)',
      '	#35305E',
      '#393249',
      'rgb(49, 25, 134)',
      'rgb(49, 25, 134)',
      '#FFFFFF',
      '#FFFFFF',
      '#d9ebf2',
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

const magmaTheme = createTheme({
  fontFamily: 'Fira Code, monospace',
  focusRing: 'never',
  colors: {
    defaultScheme: [
      '#1A0F0F',
      '#2A1F1F',
      '#3A2F2F',
      '#4A3F3F',
      '#5A4F4F',
      '#ff514a',
      '#ff916a',
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

const lavenderTheme = createTheme({
  fontFamily: 'Fira Code, monospace',
  focusRing: 'never',
  colors: {
    defaultScheme: [
      '#000000',
      '#1D1A2C',
      '#272140',
      'rgb(89, 71, 97)',
      'rgb(86, 63, 95)',
      '#a4b6dd',
      '#a4b6dd',
      '#FFFFFF',
      '#FFFFFF',
      '#CADAFD',
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

const lightTheme = createTheme({
  fontFamily: 'Fira Code, monospace',
  colors: {
    defaultScheme: [
      '#f7f7f2f5',
      '#f0f0f0f5',
      '#E7E7E2E5',
      '#C7C7C2C5',
      '#B7B7B2B5',
      '#5465ff',
      '#5465ff',
      '#f7f7f2f5',
      '#f7f7f2f5',
      '#4A4850',
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

const ThemedApp = (): JSX.Element => {
  const { theme } = useTheme();
  let usedTheme;
  const { setUiMode } = useSharedData();
  setUiMode('dark');

  if (theme === 'defaultTheme') {
    usedTheme = defaultTheme;
    setUiMode('dark');
  } else if (theme === 'oceanTheme') {
    usedTheme = oceanTheme;
    setUiMode('dark');
  } else if (theme === 'lightTheme') {
    usedTheme = lightTheme;
    setUiMode('light');
  } else if (theme === 'magmaTheme') {
    usedTheme = magmaTheme;
    setUiMode('dark');
  } else if (theme === 'lavenderTheme') {
    usedTheme = lavenderTheme;
    setUiMode('dark');
  } else if (theme === 'deepOceanTheme') {
    usedTheme = deepOceanTheme;
    setUiMode('dark');
  } else {
    usedTheme = defaultTheme;
    setUiMode('dark');
  }

  return (
    <MantineProvider defaultColorScheme="dark" theme={usedTheme}>
      <HashRouter>
        <AppWrapper />
      </HashRouter>
    </MantineProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SharedDataProvider>
        <ThemedApp />
      </SharedDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
