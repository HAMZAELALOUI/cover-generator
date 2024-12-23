import React, { useState } from 'react';
import CVTemplate from '../components/cv-template/CVTemplate';
import CVForm from '../components/cv-form/CVForm';

export default function BuilderPage() {
  const [cvData, setCvData] = useState({
    personal_info: {
      name: '',
      titre: '',
      email: '',
      phone: '',
      location: '',
      languages: {}
    },
    profil: '',
    competences: {
      techniques: []
    },
    experience_professionnelle: [],
    projets: []
  });

  const [template, setTemplate] = useState({
    id: 'executive',
    profileImage: null
  });

  const handleUpdateCV = (updatedCV) => {
    setCvData(updatedCV);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8">
          <CVTemplate 
            cvData={cvData}
            template={template}
            onUpdateCV={handleUpdateCV}
          />
        </div>
      </div>
    </div>
  );
} 