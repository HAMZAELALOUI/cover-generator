import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Preview from '../components/cover-letter/Preview';
import { cvService } from '../services/api';

export default function CoverLetter() {
  const { setCvData } = useApp();
  const [jobDescription, setJobDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [coverLetter, setCoverLetter] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ step: null, message: '' });
  const [currentFile, setCurrentFile] = useState(null);

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
      const cvData = await cvService.extractCV(currentFile);
      if (!cvData) throw new Error('Failed to extract CV data');
      setCvData(cvData);
      setStatus({ step: 'cv', message: 'CV analysis complete' });

      // Step 2: Analyze Job Description
      setStatus({ step: 'job', message: 'Analyzing job description...' });
      const jobData = await cvService.analyzeJobDescription(jobDescription);
      if (!jobData) throw new Error('Failed to analyze job description');
      setStatus({ step: 'job', message: 'Job analysis complete' });

      // Step 3: Generate Cover Letter
      setStatus({ step: 'generate', message: 'Generating cover letter...' });
      const coverLetterData = await cvService.generateCoverLetter(
        cvData,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cover Letter Generator
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Upload your CV and paste the job description to generate a personalized cover letter
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${getStatusColor('upload')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                1
              </div>
              <span className="text-sm mt-1">Upload CV</span>
            </div>
            <div className={`flex flex-col items-center ${getStatusColor('cv')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                2
              </div>
              <span className="text-sm mt-1">Analyze CV</span>
            </div>
            <div className={`flex flex-col items-center ${getStatusColor('job')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                3
              </div>
              <span className="text-sm mt-1">Analyze Job</span>
            </div>
            <div className={`flex flex-col items-center ${getStatusColor('complete')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                4
              </div>
              <span className="text-sm mt-1">Generate</span>
            </div>
          </div>
          {status.message && (
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              {status.message}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Card className="mb-8">
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Upload your CV (PDF only)
              </label>
              <div className="flex flex-col items-center space-y-4">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {fileName || 'Click to upload PDF'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
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
                className="block w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            <Button
              onClick={generateCoverLetter}
              disabled={status.step === 'generate' || !fileName || !jobDescription}
              className="w-full py-3 text-lg"
            >
              {status.step === 'generate' ? 'Generating...' : 'Generate Cover Letter'}
            </Button>
          </div>
        </Card>

        {/* Preview Section */}
        {coverLetter && <Preview content={coverLetter} />}
      </div>
    </div>
  );
}
