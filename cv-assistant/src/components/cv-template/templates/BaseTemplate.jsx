import React, { useRef } from 'react';
import DownloadPDF from '../../common/DownloadPDF';

const defaultTheme = {
  font: 'sans',
  fontSize: 'base',
  primary: 'blue',
  background: 'white',
  textColor: 'gray-900',
  sidebarBg: 'gray-100'
};

export default function BaseTemplate({ children, cvData, theme = defaultTheme, onStyleEdit }) {
  const cvRef = useRef(null);

  // Apply theme styles with fallbacks
  const mainStyles = {
    fontFamily: (theme?.font || defaultTheme.font) === 'sans' ? 'ui-sans-serif, system-ui, sans-serif' :
                (theme?.font || defaultTheme.font) === 'serif' ? 'ui-serif, Georgia, serif' :
                'ui-monospace, monospace',
    fontSize: (theme?.fontSize || defaultTheme.fontSize) === 'sm' ? '0.875rem' :
              (theme?.fontSize || defaultTheme.fontSize) === 'lg' ? '1.125rem' :
              '1rem'
  };

  return (
    <div className="max-w-[210mm] mx-auto">
      <button
        onClick={onStyleEdit}
        className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
        </svg>
        Edit Style
      </button>

      <div 
        ref={cvRef}
        style={mainStyles}
        className={`w-[210mm] h-[297mm] mx-auto bg-${theme?.background || defaultTheme.background} shadow-xl overflow-hidden`}
      >
        {children}
      </div>
      
      <DownloadPDF 
        targetRef={cvRef} 
        fileName={`${cvData.personal_info.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf`}
      />
    </div>
  );
} 