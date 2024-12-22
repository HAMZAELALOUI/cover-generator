import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';

export default function Landing() {
  const { theme, setTheme } = useApp();

  const features = [
    {
      title: 'Generate Cover Letter',
      description: 'Create personalized cover letters for your job applications',
      path: '/cover-letter',
      icon: '📝',
    },
    {
      title: 'Analyze Skills Gap',
      description: 'Compare your skills with job market requirements',
      path: '/skill-analysis',
      icon: '📊',
    },
    {
      title: 'Find Job Matches',
      description: 'Discover jobs that match your profile',
      path: '/job-search',
      icon: '🎯',
    },
    {
      title: 'Craft Your CV',
      description: 'Create and optimize your CV',
      path: '/cv-builder',
      icon: '📄',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to CV Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose a feature to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="h-full transform transition-transform hover:scale-105 hover:shadow-lg dark:bg-gray-800">
                <div className="flex flex-col items-center text-center p-6">
                  <span className="text-4xl mb-4">{feature.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 