import { useApp } from '../../context/AppContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
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
  );
} 