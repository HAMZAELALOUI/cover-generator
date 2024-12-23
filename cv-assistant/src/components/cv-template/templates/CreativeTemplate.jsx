import React, { useRef } from 'react';
import DownloadPDF from '../../common/DownloadPDF';

export default function CreativeTemplate({ 
  cvData, 
  theme = {
    font: 'sans',
    fontSize: 'base',
    primary: 'blue'
  }, 
  profileImage 
}) {
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
        {/* Header Section */}
        <header className={`bg-${theme.primary}-600 text-white p-6 print:p-6`}>
          <div className="flex items-center gap-8">
            {profileImage && (
              <img
                src={profileImage}
                alt={cvData.personal_info.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{cvData.personal_info.name}</h1>
              <h2 className="text-xl opacity-90">{cvData.personal_info.titre}</h2>
            </div>
          </div>
        </header>

        <div className="flex p-6 print:p-6 gap-6 h-[calc(297mm-88px)]">
          {/* Left Column */}
          <div className="w-1/3 space-y-4 overflow-y-auto">
            {/* Contact Info */}
            <div className={`p-4 rounded-lg bg-${theme.primary}-50`}>
              <h3 className={`text-${theme.primary}-600 font-semibold mb-3`}>Contact</h3>
              <div className="space-y-2">
                <p className="flex items-center text-sm">
                  <span className="mr-2">📧</span> {cvData.personal_info.email}
                </p>
                <p className="flex items-center text-sm">
                  <span className="mr-2">📱</span> {cvData.personal_info.phone}
                </p>
                <p className="flex items-center text-sm">
                  <span className="mr-2">📍</span> {cvData.personal_info.location}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className={`p-4 rounded-lg bg-${theme.primary}-50`}>
              <h3 className={`text-${theme.primary}-600 font-semibold mb-3`}>Competences</h3>
              <div className="flex flex-wrap gap-2">
                {cvData.competences.techniques.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full
                      bg-${theme.primary}-100 text-${theme.primary}-800`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className={`p-4 rounded-lg bg-${theme.primary}-50`}>
              <h3 className={`text-${theme.primary}-600 font-semibold mb-3`}>Langues</h3>
              {Object.entries(cvData.personal_info.languages).map(([lang, level], index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{lang}</span>
                    <span className={`text-sm text-${theme.primary}-600`}>{level}</span>
                  </div>
                  <div className={`h-1.5 bg-${theme.primary}-100 rounded-full mt-1`}>
                    <div
                      className={`h-full bg-${theme.primary}-500 rounded-full`}
                      style={{
                        width: `${
                          level === 'Native' ? '100%' :
                          level === 'Fluent' ? '90%' :
                          level === 'Intermediate' ? '60%' :
                          '40%'
                        }`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-2/3 space-y-6 overflow-y-auto">
            {/* Profile */}
            <div>
              <h3 className={`text-${theme.primary}-600 text-xl font-bold mb-4 
                border-b-2 border-${theme.primary}-200 pb-2`}>
                Profile
              </h3>
              <p className="text-gray-700 leading-relaxed">{cvData.profil}</p>
            </div>

            {/* Experience */}
            <div>
              <h3 className={`text-${theme.primary}-600 text-xl font-bold mb-4
                border-b-2 border-${theme.primary}-200 pb-2`}>
                Experience
              </h3>
              <div className="space-y-6">
                {cvData.experience_professionnelle.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                    <div className={`absolute w-3 h-3 bg-${theme.primary}-500 rounded-full -left-[7px] top-1.5`} />
                    <h4 className="font-semibold text-lg">{exp.poste}</h4>
                    <p className={`text-${theme.primary}-600 mb-2`}>
                      {exp.entreprise} | {exp.periode}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {exp.realisations.map((item, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className={`text-${theme.primary}-600 text-xl font-bold mb-4
                border-b-2 border-${theme.primary}-200 pb-2`}>
                Projects
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {cvData.projets.map((project, index) => (
                  <div key={index} className={`p-4 rounded-lg bg-${theme.primary}-50`}>
                    <h4 className="font-semibold mb-2">{project.nom}</h4>
                    <p className="text-sm text-gray-700 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs rounded-full bg-white text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DownloadPDF 
        targetRef={cvRef} 
        fileName={`${cvData.personal_info.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf`}
      />
    </div>
  );
} 