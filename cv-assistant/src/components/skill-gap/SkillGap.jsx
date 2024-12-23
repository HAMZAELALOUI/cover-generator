import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { cvService } from '../../services/api';

export default function SkillGap() {
  const { cvData, setCvData } = useApp();
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ step: null, message: '' });
  const [currentFile, setCurrentFile] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [copyNotification, setCopyNotification] = useState(false);

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

  const analyzeSkillGap = async () => {
    if (!currentFile) {
      setError('Please upload your CV first');
      return;
    }

    if (!jobDescription) {
      setError('Please enter a job description');
      return;
    }

    setError(null);
    setAnalysis(null);

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

      // Step 3: Analyze Skill Gap
      setStatus({ step: 'analyze', message: 'Analyzing skill gap...' });
      
      // Log the data being sent
      console.log('Sending to analyze-gap:', {
        cv_info: extractedCvData,
        job_analysis: jobDescription  // Send raw job description instead of analyzed data
      });

      const response = await fetch('http://127.0.0.1:8000/api/analyze-gap/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cv_info: extractedCvData,
          job_analysis: jobDescription  // Send raw job description as backend expects
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const gapAnalysis = await response.json();
      
      if (!gapAnalysis?.gap_analysis) {
        throw new Error('Failed to analyze skill gap');
      }
      
      setAnalysis(gapAnalysis.gap_analysis);
      setStatus({ step: 'complete', message: 'Analysis complete' });

    } catch (error) {
      console.error('Skill gap analysis error:', error);
      setError(error.message || 'Failed to complete the analysis. Please try again.');
      setStatus({ step: 'error', message: 'Error occurred during analysis' });
    }
  };

  const getStatusColor = (step) => {
    if (!status.step) return 'text-gray-400';
    if (status.step === 'error') return 'text-red-500';
    if (status.step === step) return 'text-blue-500';
    const steps = ['upload', 'cv', 'job', 'analyze', 'complete'];
    return steps.indexOf(status.step) >= steps.indexOf(step) ? 'text-green-500' : 'text-gray-400';
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(analysis);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  const cleanText = (text) => {
    return text
      .replace(/^\#\#\s+/gm, '') // Remove markdown headers
      .replace(/\*\*/g, '')      // Remove bold markers
      .replace(/^\* /gm, '')     // Remove list markers
      .trim();
  };

  const parseAnalysis = (analysisText) => {
    // Split into main sections
    const sections = analysisText.split(/(?=\d\. )/);
    
    // Extract introduction
    const introduction = cleanText(sections[0]);
    
    // Parse numbered sections
    const mainSections = sections.slice(1).map(section => {
      const [title, ...content] = section.split('\n');
      return {
        title: cleanText(title),
        content: content
          .filter(line => line.trim())
          .map(line => {
            const cleaned = cleanText(line);
            return {
              text: cleaned,
              isSubItem: line.startsWith('    ') || line.startsWith('\t'),
            };
          })
      };
    });

    return { introduction, mainSections };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Skill Gap Analysis
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Compare your skills with job requirements
          </p>
        </div>

        {/* Progress Steps - Matching Cover Letter Design */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${getStatusColor('upload')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
              <span className="text-sm mt-1">Upload CV</span>
            </div>
            <div className={`flex flex-col items-center ${getStatusColor('cv')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
              <span className="text-sm mt-1">Analyze CV</span>
            </div>
            <div className={`flex flex-col items-center ${getStatusColor('job')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">3</div>
              <span className="text-sm mt-1">Analyze Job</span>
            </div>
            <div className={`flex flex-col items-center ${getStatusColor('complete')}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">4</div>
              <span className="text-sm mt-1">Results</span>
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

            <Button
              onClick={analyzeSkillGap}
              disabled={!fileName || !jobDescription}
              className="w-full"
            >
              Analyze Skill Gap
            </Button>
          </div>
        </Card>

        {analysis && (
          <Card title="Skill Gap Analysis Results">
            <div className="space-y-6">
              {/* Introduction */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Gap Analysis Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {parseAnalysis(analysis).introduction}
                </p>
              </div>

              {/* Main sections */}
              {parseAnalysis(analysis).mainSections.map((section, index) => {
                const sectionId = `section-${index}`;
                const isExpanded = expandedSections[sectionId] !== false;

                return (
                  <div key={sectionId} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {section.title}
                      </h3>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                    
                    {isExpanded && (
                      <div className="pb-4 space-y-3">
                        {section.content.map((item, pIndex) => (
                          <p 
                            key={pIndex} 
                            className={`text-gray-700 dark:text-gray-300 ${
                              item.isSubItem ? 'ml-6' : ''
                            }`}
                          >
                            {item.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Action buttons */}
              <div className="flex gap-4 mt-6 relative">
                <Button
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" />
                  </svg>
                  Print Analysis
                </Button>
                <Button
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy to Clipboard
                </Button>
                
                {copyNotification && (
                  <div className="absolute -top-10 right-0 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
                    Copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 