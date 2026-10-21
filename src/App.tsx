import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { MatchesPage } from './pages/MatchesPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { DashboardPage } from './pages/DashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] selection:bg-teal-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/report-lost" element={<ReportLostPage />} />
                <Route path="/report-found" element={<ReportFoundPage />} />
                <Route path="/item/:id" element={<ItemDetailPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/claims" element={<ClaimsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
