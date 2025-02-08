import React, { useState } from 'react';
import { Document, Page } from '@react-pdf/renderer';
import Card from '../common/Card';

export default function PDFPreview({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  if (!file) return null;

  return (
    <Card>
      <div className="flex flex-col items-center">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          <Page 
            pageNumber={pageNumber} 
            className="pdf-page"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
        
        <div className="flex justify-between items-center w-full mt-4 p-4">
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={() => changePage(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {pageNumber} of {numPages || '--'}
          </p>
          <button
            type="button"
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => changePage(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
} 