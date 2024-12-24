import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import JobMatches from '../components/dashboard/JobMatches';
import { cvService } from '../services/api';

export default function JobSearch() {
  const { cvData, setCvData } = useApp();
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a PDF or image file (jpg, jpeg, png)');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    return true;
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file before upload
      validateFile(file);

      setCurrentFile(file);
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Extract CV data using the service
      const extractedData = await cvService.extractCV(file);
      
      // Update app context with extracted data
      setCvData(extractedData);
      
      // Reset states after successful upload
      setUploadProgress(100);
      setError(null);
    } catch (err) {
      console.error('Error uploading CV:', err);
      setError(err.message);
      setCurrentFile(null);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Job Search Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Upload your CV to find matching job opportunities
          </p>
        </div>

        {!cvData ? (
          <Card className="max-w-2xl mx-auto">
            <div className="p-6 text-center">
              <div className="mb-6">
                <span className="text-4xl">📄</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload Your CV
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <label
                  htmlFor="cv-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing CV...
                    </div>
                  ) : (
                    'Choose File'
                  )}
                </label>

                {currentFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {currentFile.name}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <JobMatches />
            <div className="text-center mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setCvData(null);
                  setCurrentFile(null);
                  setUploadProgress(0);
                }}
              >
                Upload Different CV
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
