import React from 'react';
import BaseTemplate from './BaseTemplate';
import EditSection from '../../common/EditSection';

// Define default theme
const defaultTheme = {
  font: 'sans',
  fontSize: 'base',
  primary: 'blue',
  background: 'white',
  textColor: 'gray-900',
  sidebarBg: 'gray-100'
};

export default function ExecutiveTemplate({ 
  cvData, 
  theme = defaultTheme, // Provide default theme
  profileImage,
  onEditSection,
  onThemeChange,
  onStyleEdit
}) {
  // Ensure theme exists with fallbacks
  const currentTheme = {
    ...defaultTheme,
    ...theme
  };

  return (
    <BaseTemplate
      cvData={cvData}
      theme={currentTheme}
      onStyleEdit={onStyleEdit}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className={`w-1/3 h-full bg-${currentTheme.sidebarBg} p-6 print:p-6`}>
          {/* Personal Info Section */}
          <div className="relative group mb-8">
            <EditSection 
              onEdit={() => {
                console.log('Editing personal info'); // Debug log
                onEditSection('personal_info');
              }} 
            />
            {profileImage && (
              <div className="mb-8">
                <img
                  src={profileImage}
                  alt={cvData.personal_info.name}
                  className={`w-48 h-48 rounded-full mx-auto object-cover border-4 border-${currentTheme.primary}-200 shadow-lg`}
                />
              </div>
            )}
            <div className="space-y-4">
              <h2 className={`text-xl font-bold text-${currentTheme.primary}-600`}>
                {cvData.personal_info.name}
              </h2>
              <p className="text-gray-600">{cvData.personal_info.titre}</p>
              
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className={`mr-2 text-${currentTheme.primary}-500`}>📧</span> 
                  {cvData.personal_info.email}
                </p>
                <p className="flex items-center">
                  <span className={`mr-2 text-${currentTheme.primary}-500`}>📱</span> 
                  {cvData.personal_info.phone}
                </p>
                <p className="flex items-center">
                  <span className={`mr-2 text-${currentTheme.primary}-500`}>📍</span> 
                  {cvData.personal_info.location}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="relative group mb-8">
            <EditSection 
              onEdit={() => {
                console.log('Editing competences'); // Debug log
                onEditSection('competences');
              }} 
            />
            <h3 className={`text-lg font-semibold text-${currentTheme.primary}-600 mb-4`}>
              Competences
            </h3>
            <div className="space-y-2">
              {cvData.competences.techniques.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full bg-${currentTheme.primary}-500 mr-2`} />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Languages Section */}
          <div className="relative group">
            <EditSection 
              onEdit={() => {
                console.log('Editing languages'); // Debug log
                onEditSection('languages');
              }} 
            />
            <h3 className={`text-lg font-semibold text-${currentTheme.primary}-600 mb-4`}>
              Langues
            </h3>
            {Object.entries(cvData.personal_info.languages || {}).map(([lang, level], index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <span>{lang}</span>
                  <span className={`text-${currentTheme.primary}-600`}>{level}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-2/3 p-6 print:p-6">
          {/* Profile */}
          <div className="relative group mb-8">
            <EditSection 
              onEdit={() => {
                console.log('Editing profile'); // Debug log
                onEditSection('profile');
              }} 
            />
            <h3 className={`text-${currentTheme.primary}-600 text-xl font-bold mb-4`}>
              Profile
            </h3>
            <p className="text-gray-700">{cvData.profil}</p>
          </div>

          {/* Experience */}
          <div className="relative group mb-8">
            <EditSection 
              onEdit={() => {
                console.log('Editing experience'); // Debug log
                onEditSection('experience');
              }} 
            />
            <h3 className={`text-${currentTheme.primary}-600 text-xl font-bold mb-4`}>
              Experience
            </h3>
            {cvData.experience_professionnelle.map((exp, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-semibold">{exp.poste}</h4>
                <p className={`text-${currentTheme.primary}-600`}>
                  {exp.entreprise} | {exp.periode}
                </p>
                <ul className="mt-2 list-disc list-inside">
                  {exp.realisations.map((item, idx) => (
                    <li key={idx} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="relative group">
            <EditSection 
              onEdit={() => {
                console.log('Editing projects'); // Debug log
                onEditSection('projects');
              }} 
            />
            <h3 className={`text-${currentTheme.primary}-600 text-xl font-bold mb-4`}>
              Projects
            </h3>
            {cvData.projets.map((project, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-semibold">{project.nom}</h4>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 text-sm rounded-full
                        bg-${currentTheme.primary}-100 text-${currentTheme.primary}-800`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
} 