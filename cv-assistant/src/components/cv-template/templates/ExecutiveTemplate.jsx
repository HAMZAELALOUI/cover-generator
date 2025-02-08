import React from 'react';

export default function ExecutiveTemplate({ cvData, theme, profileImage }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      {/* Header Section */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {cvData?.personal_info?.name}
        </h1>
        <h2 className="text-xl text-gray-700 dark:text-gray-200 mb-2">
          {cvData?.personal_info?.titre}
        </h2>
        <div className="text-gray-600 dark:text-gray-300">
          <p>{cvData?.personal_info?.email}</p>
          <p>{cvData?.personal_info?.phone}</p>
          <p>{cvData?.personal_info?.location}</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Profil
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {cvData?.profil}
        </p>
      </div>

      {/* Experience Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Experience Professionnelle
        </h2>
        {cvData?.experience_professionnelle?.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-medium text-gray-800 dark:text-white">
              {exp.poste}
            </h3>
            <h4 className="text-lg text-gray-700 dark:text-gray-200">
              {exp.entreprise}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 mb-2">{exp.periode}</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              {exp.realisations?.map((realisation, idx) => (
                <li key={idx}>{realisation}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Compétences
        </h2>
        {Object.entries(cvData?.competences || {}).map(([category, skills]) => (
          <div key={category} className="mb-4">
            <h3 className="text-xl font-medium text-gray-800 dark:text-white capitalize mb-2">
              {category.replace('_', ' ')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Array.isArray(skills) && skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Langues
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(cvData?.personal_info?.languages || {}).map(([lang, level], index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{lang}</span>
              <span className="text-gray-600 dark:text-gray-400">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}