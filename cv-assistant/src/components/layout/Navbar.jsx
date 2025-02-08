import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">CV Assistant</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/cover-letter"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Cover Letter
              </Link>
              <Link
                to="/job-search"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Job Search
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
