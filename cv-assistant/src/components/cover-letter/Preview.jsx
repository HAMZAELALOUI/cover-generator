import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import html2pdf from 'html2pdf.js';

export default function Preview({ content, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="white-space: pre-wrap; font-size: 12pt; line-height: 1.5;">
          ${editedContent}
        </div>
      </div>
    `;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'cover-letter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(editedContent);
    }
  };

  return (
    <Card title="Preview">
      <div className="space-y-4">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-96 p-4 bg-white dark:bg-gray-700 rounded-md 
                     border border-gray-200 dark:border-gray-600
                     text-gray-900 dark:text-gray-100 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-none"
            placeholder="Edit your cover letter here..."
          />
        ) : (
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-md 
                        whitespace-pre-wrap text-gray-900 dark:text-gray-100 
                        border border-gray-200 dark:border-gray-600 min-h-[24rem]">
            {editedContent}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </>
              )}
            </Button>
            {isEditing && (
              <Button
                onClick={handleSave}
                variant="primary"
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Changes
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleCopy} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              {copyStatus || 'Copy Text'}
            </Button>
            <Button 
              onClick={handleDownloadPDF} 
              variant="primary"
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
