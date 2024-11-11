import { Routes, Route } from 'react-router-dom';
import { ScreenWithSidebar } from '../ScreenWithSidebar';
import { HomeViewScreen } from './HomeViewScreen';
import { EditNodeMetaScreen } from '../EditNodeMetaScreen';

export const HomeScreen = (): JSX.Element => (
  <ScreenWithSidebar>
    <Routes>
      <Route path="/" element={<HomeViewScreen />} />
      <Route path="/view" element={<HomeViewScreen />} />
      <Route path="/edit-node-meta" element={<EditNodeMetaScreen />} />
    </Routes>
  </ScreenWithSidebar>
);
