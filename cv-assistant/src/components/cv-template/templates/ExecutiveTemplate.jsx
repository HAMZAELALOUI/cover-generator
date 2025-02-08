import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function ExecutiveTemplate({ cvData, theme, profileImage }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Helper function for text wrapping
      const addWrappedText = (text, y, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize);
        if (isBold) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');
        
        const textWidth = 170; // Adjusted width for better text wrapping
        const splitText = doc.splitTextToSize(text, textWidth);
        doc.text(splitText, 20, y);
        return (splitText.length * fontSize * 0.3527) + 2;
      };

      // Set initial position
      let y = 20;

      // Name (Large and Bold)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(cvData?.personal_info?.name || '', 20, y);
      y += 15;

      // Contact Info (Inline with icons)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const contactInfo = [
        `📍 ${cvData?.personal_info?.location || ''}`,
        `📞 ${cvData?.personal_info?.phone || ''}`,
        `✉️ ${cvData?.personal_info?.email || ''}`
      ].filter(Boolean).join('    ');
      doc.text(contactInfo, 20, y);
      y += 15;

      // Professional Summary
      doc.setFont('helvetica', 'normal');
      y += addWrappedText(cvData?.profil || '', y, 11);
      y += 10;

      // Work Experience Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('WORK EXPERIENCE', 20, y);
      y += 8;

      // Experience entries
      cvData?.experience_professionnelle?.forEach(exp => {
        // Job Title and Date
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(exp.poste, 20, y);
        
        // Right-aligned date
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const dateWidth = doc.getTextWidth(exp.periode);
        doc.text(exp.periode, 190 - dateWidth, y);
        y += 5;

        // Company
        doc.setFont('helvetica', 'normal');
        doc.text(exp.entreprise, 20, y);
        y += 5;

        // Achievements
        exp.realisations?.forEach(realisation => {
          y += addWrappedText(`• ${realisation}`, y, 10);
        });
        y += 5;
      });

      // Skills Section
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('HARD SKILLS', 20, y);
      y += 8;

      // Skills content
      Object.entries(cvData?.competences || {}).forEach(([category, skills]) => {
        if (Array.isArray(skills)) {
          y += addWrappedText(skills.join(', '), y, 10);
        }
      });

      // Education Section
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('EDUCATION AND CERTIFICATES', 20, y);
      y += 8;

      // Education entries
      cvData?.formation?.forEach(edu => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(edu.diplome, 20, y);
        y += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${edu.etablissement} | ${edu.periode}`, 20, y);
        y += 7;
      });

      // Languages Section
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('LANGUAGES', 20, y);
      y += 8;

      // Languages content
      const languages = Object.entries(cvData?.personal_info?.languages || {})
        .map(([lang, level]) => `${lang}: ${level}`)
        .join(' | ');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(languages, 20, y);

      // Save the PDF
      doc.save(`${cvData?.personal_info?.name || 'CV'}.pdf`);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
    }
  };

  // Template Preview
  return (
    <div className="relative">
      {/* Download Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <span>Generating PDF...</span>
          ) : (
            <span>Download ATS-Friendly PDF</span>
          )}
        </button>
      </div>

      {/* CV Preview */}
      <div id="cv-content" className="p-8 bg-white max-w-4xl mx-auto">
        {/* Header with accent color */}
        <div className="mb-8 border-l-4 border-blue-600 pl-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{cvData?.personal_info?.name}</h1>
          <h2 className="text-xl text-gray-700 mb-3">{cvData?.personal_info?.titre}</h2>
          <div className="text-gray-600 space-y-1">
            <div>{cvData?.personal_info?.location}</div>
            <div>{cvData?.personal_info?.phone}</div>
            <div>{cvData?.personal_info?.email}</div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed border-b pb-4">{cvData?.profil}</p>
        </div>

        {/* Work Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gray-50 p-2 border-l-4 border-blue-600">
            WORK EXPERIENCE
          </h2>
          {cvData?.experience_professionnelle?.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{exp.poste}</h3>
                  <p className="text-gray-700">{exp.entreprise}</p>
                </div>
                <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded">
                  {exp.periode}
                </span>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                {exp.realisations?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gray-50 p-2 border-l-4 border-blue-600">
            HARD SKILLS
          </h2>
          <div className="space-y-3">
            {Object.entries(cvData?.competences || {}).map(([category, skills]) => (
              Array.isArray(skills) && (
                <div key={category} className="text-gray-600">
                  <span className="font-semibold text-gray-700">{category}: </span>
                  {skills.map((skill, index) => (
                    <span key={index} className="inline-block bg-gray-50 px-3 py-1 rounded mr-2 mb-2">
                      {skill}
                    </span>
                  ))}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gray-50 p-2 border-l-4 border-blue-600">
            EDUCATION AND CERTIFICATES
          </h2>
          {cvData?.formation?.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-800">{edu.diplome}</h3>
              <div className="flex justify-between items-center text-gray-600">
                <span>{edu.etablissement}</span>
                <span className="text-gray-500">{edu.periode}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 bg-gray-50 p-2 border-l-4 border-blue-600">
            LANGUAGES
          </h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(cvData?.personal_info?.languages || {}).map(([lang, level], index) => (
              <div key={index} className="bg-gray-50 px-4 py-2 rounded">
                <span className="font-semibold text-gray-700">{lang}: </span>
                <span className="text-gray-600">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}