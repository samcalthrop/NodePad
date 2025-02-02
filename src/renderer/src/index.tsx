import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/main.css';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { SharedDataProvider } from './providers/SharedDataProvider';

const theme = createTheme({
  fontFamily: 'Fira Code, monospace',
  colors: {
    grey: [
      '#868e96',
      '#868e96',
      '#868e96',
      '#868e96',
      '#868e96',
      '#868e96',
      '#868e96',
      '#4A484F',
      '#28262D',
      '#19161E',
    ],
    purple: [
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#F8D6F9',
      '#5D4A79',
    ],
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
    fontFamily: 'Fredoka, sans-serif',
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <SharedDataProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/home/*" element={<HomeScreen />} />
          </Routes>
        </HashRouter>
      </SharedDataProvider>
    </MantineProvider>
  </React.StrictMode>
);
