import React, { useRef } from 'react';
import DownloadPDF from '../../common/DownloadPDF';

export default function ExecutiveTemplate({ cvData, theme = { font: 'sans', fontSize: 'base', primary: 'blue' }, profileImage }) {
  const cvRef = useRef(null);

  return (
    <div className="max-w-[210mm] mx-auto">
      <div 
        ref={cvRef}
        className={`w-[210mm] h-[297mm] mx-auto bg-white shadow-xl
          font-${theme.font} text-${theme.fontSize} overflow-hidden`}
        style={{
          pageBreakAfter: 'always',
          printColorAdjust: 'exact'
        }}>
        
        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="w-1/3 h-full bg-gray-100 p-6 print:p-6">
            {/* Profile Image */}
            {profileImage && (
              <div className="mb-8">
                <img
                  src={profileImage}
                  alt={cvData.personal_info.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{cvData.personal_info.name}</h2>
              <p className="text-gray-600">{cvData.personal_info.titre}</p>
              
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="mr-2">📧</span> {cvData.personal_info.email}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📱</span> {cvData.personal_info.phone}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📍</span> {cvData.personal_info.location}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Competences</h3>
              <div className="space-y-2">
                {cvData.competences.techniques.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-${theme.primary}-500 mr-2`} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Langues</h3>
              {Object.entries(cvData.personal_info.languages).map(([lang, level], index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between">
                    <span>{lang}</span>
                    <span className="text-gray-600">{level}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-2/3 p-6 print:p-6">
            {/* Profile */}
            <div className="mb-8">
              <h3 className={`text-${theme.primary}-600 text-xl font-bold mb-4`}>
                Profile
              </h3>
              <p className="text-gray-700">{cvData.profil}</p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h3 className={`text-${theme.primary}-600 text-xl font-bold mb-4`}>
                Experience
              </h3>
              {cvData.experience_professionnelle.map((exp, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-semibold">{exp.poste}</h4>
                  <p className="text-gray-600">{exp.entreprise} | {exp.periode}</p>
                  <ul className="mt-2 list-disc list-inside">
                    {exp.realisations.map((item, idx) => (
                      <li key={idx} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <h3 className={`text-${theme.primary}-600 text-xl font-bold mb-4`}>
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
                          bg-${theme.primary}-100 text-${theme.primary}-800`}
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
      </div>
      
      <DownloadPDF 
        targetRef={cvRef} 
        fileName={`${cvData.personal_info.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf`}
      />
    </div>
  );
} 