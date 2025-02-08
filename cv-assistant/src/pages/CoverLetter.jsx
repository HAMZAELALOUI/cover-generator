import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Preview from '../components/cover-letter/Preview';
import { cvService } from '../services/api';

export default function CoverLetter() {
  const { cvData, setCvData } = useApp();
  const [jobDescription, setJobDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [coverLetter, setCoverLetter] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ step: null, message: '' });
  const [currentFile, setCurrentFile] = useState(null);
  const [editedCoverLetter, setEditedCoverLetter] = useState(null);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Dutch', 'Chinese', 'Japanese', 'Korean'
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setFileName(file.name);
    setCurrentFile(file);
    setError(null);
    setStatus({ step: 'upload', message: 'CV uploaded successfully' });
  };

  const generateCoverLetter = async () => {
    if (!currentFile) {
      setError('Please upload your CV first');
      return;
    }

    if (!jobDescription) {
      setError('Please enter a job description');
      return;
    }

    setError(null);
    setCoverLetter(null);

    try {
      // Step 1: Extract CV
      setStatus({ step: 'cv', message: 'Analyzing CV...' });
      const extractedCvData = await cvService.extractCV(currentFile);
      if (!extractedCvData) throw new Error('Failed to extract CV data');
      setCvData(extractedCvData);
      setStatus({ step: 'cv', message: 'CV analysis complete' });

      // Step 2: Analyze Job Description
      setStatus({ step: 'job', message: 'Analyzing job description...' });
      const jobData = await cvService.analyzeJobDescription(jobDescription);
      if (!jobData) throw new Error('Failed to analyze job description');
      setStatus({ step: 'job', message: 'Job analysis complete' });

      // Step 3: Generate Cover Letter
      setStatus({ step: 'generate', message: 'Generating cover letter...' });
      const coverLetterData = await cvService.generateCoverLetter(
        extractedCvData,
        jobData,
        language
      );
      
      if (!coverLetterData?.cover_letter) {
        throw new Error('Failed to generate cover letter');
      }
      
      setCoverLetter(coverLetterData.cover_letter);
      setStatus({ step: 'complete', message: 'Cover letter generated successfully' });

    } catch (error) {
      console.error('Error in generation process:', error);
      setError(error.message || 'Failed to complete the process. Please try again.');
      setStatus({ step: 'error', message: 'Error occurred during generation' });
    }
  };

  const getStatusColor = (currentStep) => {
    if (status.step === 'error') return 'text-red-500';
    if (!status.step) return 'text-gray-400';
    const steps = ['upload', 'cv', 'job', 'generate', 'complete'];
    return steps.indexOf(currentStep) <= steps.indexOf(status.step)
      ? 'text-green-500'
      : 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Cover Letter Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create a professional cover letter in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute h-1 bg-gray-200 dark:bg-gray-700 top-4 left-0 right-0 -z-10"></div>
            
            {['upload', 'cv', 'job', 'complete'].map((step, index) => (
              <div key={step} className={`flex flex-col items-center ${getStatusColor(step)}`}>
                <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white dark:bg-gray-800 shadow-md">
                  {index + 1}
                </div>
                <span className="text-sm mt-2 font-medium">{
                  {
                    'upload': 'Upload CV',
                    'cv': 'Analyze CV',
                    'job': 'Analyze Job',
                    'complete': 'Generate'
                  }[step]
                }</span>
              </div>
            ))}
          </div>
          {status.message && (
            <div className="text-center mt-6 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
              {status.message}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <Card className="mb-8 shadow-xl">
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="text-center">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Upload your CV
              </label>
              <div className="flex flex-col items-center space-y-4">
                <label className="cursor-pointer w-full">
                  <div className="flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-base text-gray-500 dark:text-gray-400">
                      {fileName || 'Drop your PDF here, or click to browse'}
                    </span>
                    <span className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                      PDF files only
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileUpload}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="block w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            <Button
              onClick={generateCoverLetter}
              disabled={status.step === 'generate' || !fileName || !jobDescription}
              className="w-full py-4 text-lg font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {status.step === 'generate' ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                'Generate Cover Letter'
              )}
            </Button>
          </div>
        </Card>

        {/* Preview Section */}
        {coverLetter && (
          <div className="transform transition-all duration-500 ease-in-out">
            <Preview 
              content={editedCoverLetter || coverLetter} 
              onUpdate={setEditedCoverLetter} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
