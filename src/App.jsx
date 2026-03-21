import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Toast from './components/Toast';
import UpdateBanner from './components/UpdateBanner';
import HomePage from './pages/HomePage';
import BookmarksPage from './pages/BookmarksPage';
import SearchPage from './pages/SearchPage';
import OfflinePage from './pages/OfflinePage';
import './styles/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Header />
        <UpdateBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<OfflinePage />} />
        </Routes>
        <Toast />
      </AppProvider>
    </BrowserRouter>
  );
}
