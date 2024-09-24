import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/main.css';
import { EditNodeMetaScreen } from './screens/EditNodeMetaScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { Screen } from './screens/Screen';

const theme = createTheme({
  defaultRadius: 6,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Screen> </Screen>} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/edit-node-meta" element={<EditNodeMetaScreen />} />
        </Routes>
      </HashRouter>
    </MantineProvider>
  </React.StrictMode>
);
