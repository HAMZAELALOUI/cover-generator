import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CoverLetter from './pages/CoverLetter';
import SkillAnalysis from './pages/SkillAnalysis';
import JobSearch from './pages/JobSearch';
import CraftCV from './pages/CraftCV';
import Profile from './pages/Profile';
import { AppProvider } from './context/AppContext';

console.log('CraftCV component loaded:', CraftCV);

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
            <Route path="/skill-analysis" element={<SkillAnalysis />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/craft-cv" element={<CraftCV />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;