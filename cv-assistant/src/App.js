import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CoverLetter from './pages/CoverLetter';
import JobSearch from './pages/JobSearch';
import Profile from './pages/Profile';
import CraftCV from './pages/CraftCV';
import { useApp } from './context/AppContext';
import SkillGap from './components/skill-gap/SkillGap';

function AppContent() {
  const { theme } = useApp();

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/cover-letter" element={<CoverLetter />} />
                    <Route path="/skill-analysis" element={<SkillGap />} />
                    <Route path="/job-search" element={<JobSearch />} />
                    <Route path="/craft-cv" element={<CraftCV />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
