import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }) {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
