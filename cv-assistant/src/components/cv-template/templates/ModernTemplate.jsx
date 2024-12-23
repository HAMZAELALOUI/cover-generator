import React from 'react';

export default function ModernTemplate({ cvData }) {
  if (!cvData) return null;

  return (
    <div className="max-w-[1000px] mx-auto bg-white shadow-lg">
      <div className="grid grid-cols-12 min-h-screen">
        {/* Left Column - 4 columns wide */}
        <div className="col-span-4 bg-gray-50 p-8">
          {/* Personal Info */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{cvData.personal_info.name}</h1>
            <h2 className="text-lg text-gray-600 mb-4">{cvData.personal_info.titre}</h2>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <span className="mr-3">📧</span>
                <span>{cvData.personal_info.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-3">📱</span>
                <span>{cvData.personal_info.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-3">📍</span>
                <span>{cvData.personal_info.location}</span>
              </div>
            </div>
          </div>

          {/* Competences */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Competences</h3>
            <ul className="space-y-2">
              {cvData.competences.techniques.map((skill, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Langues</h3>
            {Object.entries(cvData.personal_info.languages).map(([lang, level], index) => (
              <div key={index} className="flex justify-between mb-2">
                <span className="text-gray-700">{lang}</span>
                <span className="text-gray-600">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - 8 columns wide */}
        <div className="col-span-8 p-8 bg-white">
          {/* Profile Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Profile</h3>
            <p className="text-gray-700 leading-relaxed">{cvData.profil}</p>
          </div>

          {/* Experience Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-blue-600 mb-6">Experience</h3>
            {cvData.experience_professionnelle.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{exp.poste}</h4>
                  <span className="text-gray-600">{exp.periode}</span>
                </div>
                <p className="text-gray-600 mb-3">{exp.entreprise}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {exp.realisations.map((item, idx) => (
                    <li key={idx} className="ml-4">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-6">Projects</h3>
            {cvData.projets.map((project, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">{project.nom}</h4>
                <p className="text-gray-700 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
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
  );
} 