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
  defaultRadius: 6,
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
