import React, { useState } from 'react';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import EditModal from '../common/EditModal';
import StyleEditor from './StyleEditor';

// Define default theme
const defaultTheme = {
  font: 'sans',
  fontSize: 'base',
  primary: 'blue',
  background: 'white',
  textColor: 'gray-900',
  sidebarBg: 'gray-100'
};

export default function CVTemplate({ cvData, template, onUpdateCV }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [editingSection, setEditingSection] = useState(null);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const handleThemeChange = (newTheme) => {
    console.log('Theme changed:', newTheme);
    setCurrentTheme({ ...defaultTheme, ...newTheme });
  };

  const handleEditSection = (sectionName) => {
    console.log('Editing section:', sectionName);
    setEditingSection(sectionName);
  };

  const handleUpdateSection = (sectionName, newData) => {
    console.log('Updating section:', sectionName, newData);
    const updatedCV = { ...cvData };
    
    switch(sectionName) {
      case 'personal_info':
        updatedCV.personal_info = { ...updatedCV.personal_info, ...newData };
        break;
      case 'profile':
        updatedCV.profil = newData;
        break;
      case 'competences':
        updatedCV.competences = { ...updatedCV.competences, ...newData };
        break;
      case 'experience':
        updatedCV.experience_professionnelle = newData;
        break;
      case 'projects':
        updatedCV.projets = newData;
        break;
      case 'languages':
        updatedCV.personal_info.languages = newData;
        break;
      default:
        break;
    }

    onUpdateCV(updatedCV);
    setEditingSection(null);
  };

  const getSectionData = (section) => {
    switch(section) {
      case 'personal_info':
        return cvData.personal_info;
      case 'profile':
        return cvData.profil;
      case 'competences':
        return cvData.competences;
      case 'experience':
        return cvData.experience_professionnelle;
      case 'projects':
        return cvData.projets;
      case 'languages':
        return cvData.personal_info.languages;
      default:
        return null;
    }
  };

  const templateProps = {
    cvData,
    theme: currentTheme,
    profileImage: template.profileImage,
    onEditSection: handleEditSection,
    onThemeChange: handleThemeChange,
    onStyleEdit: () => setShowStyleEditor(true)
  };

  return (
    <div className="relative">
      {template.id === 'executive' ? (
        <ExecutiveTemplate {...templateProps} />
      ) : (
        <CreativeTemplate {...templateProps} />
      )}
      
      {editingSection && (
        <EditModal
          isOpen={true}
          section={editingSection}
          data={getSectionData(editingSection)}
          onClose={() => setEditingSection(null)}
          onSave={(newData) => handleUpdateSection(editingSection, newData)}
        />
      )}

      <StyleEditor
        isOpen={showStyleEditor}
        onClose={() => setShowStyleEditor(false)}
        theme={currentTheme}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
} 