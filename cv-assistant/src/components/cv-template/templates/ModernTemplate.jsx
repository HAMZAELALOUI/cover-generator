import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ModernTemplate({ cvData, theme, profileImage, generatedPdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [viewMode, setViewMode] = useState('template'); // 'template' or 'pdf'

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      {/* View Toggle */}
      <div className="mb-4 flex justify-end">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setViewMode('template')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'template' 
                ? 'bg-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Template View
          </button>
          <button
            onClick={() => setViewMode('pdf')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'pdf' 
                ? 'bg-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            PDF View
          </button>
        </div>
      </div>

      {viewMode === 'template' ? (
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {cvData?.personal_info?.name}
            </h1>
            <h2 className="text-xl text-gray-700 dark:text-gray-200 mb-4">
              {cvData?.personal_info?.titre}
            </h2>
            <div className="flex justify-center gap-4 text-gray-600 dark:text-gray-300">
              <span>{cvData?.personal_info?.email}</span>
              <span>{cvData?.personal_info?.phone}</span>
              <span>{cvData?.personal_info?.location}</span>
            </div>
          </div>

          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
              Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {cvData?.profil}
            </p>
          </div>

          {/* Professional Experience */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
              Professional Experience
            </h2>
            {cvData?.experience_professionnelle?.map((exp, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                  {exp.poste}
                </h3>
                <h4 className="text-lg text-gray-700 dark:text-gray-200">
                  {exp.entreprise}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {exp.periode}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  {exp.realisations?.map((realisation, idx) => (
                    <li key={idx}>{realisation}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData?.competences?.techniques?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(cvData?.personal_info?.languages || {}).map(([lang, level], index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{lang}</span>
                  <span className="text-gray-600 dark:text-gray-400">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // PDF View
        <div className="flex flex-col items-center">
          {/* PDF Controls */}
          <div className="w-full mb-4 flex justify-between items-center p-2 bg-gray-50 rounded">
            {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages || '--'}
              </span>
              <button
                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                disabled={pageNumber >= (numPages || 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="w-full overflow-auto">
            <Document
              file={generatedPdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              }
              error={
                <div className="text-center text-red-500 p-4">
                  Failed to load PDF. Please try again.
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="mx-auto"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                }
              />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
} 