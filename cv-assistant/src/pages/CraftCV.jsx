import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import CVTemplate from '../components/cv-template/CVTemplate';
import { cvService } from '../services/api';

export default function CraftCV() {
  const { cvData, setCvData } = useApp();
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ step: null, message: '' });
  const [currentFile, setCurrentFile] = useState(null);
  const [craftedCV, setCraftedCV] = useState(null);

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

  const craftCV = async () => {
    if (!currentFile) {
      setError('Please upload your CV first');
      return;
    }

    if (!jobDescription) {
      setError('Please enter a job description');
      return;
    }

    setError(null);
    setCraftedCV(null);

    try {
      // Step 1: Extract CV
      setStatus({ step: 'cv', message: 'Analyzing CV...' });
      const formData = new FormData();
      formData.append('file', currentFile);

      const extractResponse = await fetch('http://127.0.0.1:8000/api/extract-cv/', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to extract CV data');
      }

      const extractedCvData = await extractResponse.json();
      setCvData(extractedCvData);
      setStatus({ step: 'cv', message: 'CV analysis complete' });

      // Step 2: Craft CV with Job Description
      setStatus({ step: 'job', message: 'Crafting CV...' });
      
      // Log the data being sent for debugging
      console.log('Sending to craft-cv:', {
        original_cv: extractedCvData,
        job_description: jobDescription
      });

      const craftResponse = await fetch('http://127.0.0.1:8000/api/craft-cv/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_cv: extractedCvData,
          job_description: jobDescription
        }),
      });

      if (!craftResponse.ok) {
        const errorData = await craftResponse.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData?.error || 'Failed to craft CV');
      }

      const data = await craftResponse.json();
      setCraftedCV(data);
      setStatus({ step: 'complete', message: 'CV crafted successfully' });

    } catch (error) {
      console.error('Error in CV crafting process:', error);
      setError(error.message || 'Failed to complete the process. Please try again.');
      setStatus({ step: 'error', message: 'Error occurred during generation' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CV Crafting
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Optimize your CV for specific job descriptions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${status.step === 'upload' ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
              <span className="text-sm mt-1">Upload CV</span>
            </div>
            <div className={`flex flex-col items-center ${status.step === 'cv' ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
              <span className="text-sm mt-1">Analyze</span>
            </div>
            <div className={`flex flex-col items-center ${status.step === 'complete' ? 'text-blue-500' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">3</div>
              <span className="text-sm mt-1">Generate</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Card className="mb-8">
          <div className="space-y-8">
            {/* File Upload */}
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

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="block w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Paste the job description here..."
              />
            </div>

            {/* Craft Button */}
            <Button
              onClick={craftCV}
              disabled={!fileName || !jobDescription}
              className="w-full"
            >
              {status.step === 'cv' ? 'Crafting...' : 'Craft CV'}
            </Button>
          </div>
        </Card>

        {/* CV Preview */}
        {craftedCV && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Crafted CV Preview</h2>
            <CVTemplate cvData={craftedCV} />
          </div>
        )}
      </div>
    </div>
  );
} 