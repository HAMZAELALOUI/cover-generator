import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function CVTemplate({ generatedPdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4">
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
  );
} 