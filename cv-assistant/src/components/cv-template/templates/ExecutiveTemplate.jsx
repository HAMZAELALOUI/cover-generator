import React from 'react';

export default function ExecutiveTemplate({ cvData, theme, profileImage }) {
  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header Section with gradient background */}
      <div className="mb-8 pb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {cvData?.personal_info?.name}
              </h1>
              <h2 className="text-2xl text-gray-700 dark:text-gray-200 mb-3">
                {cvData?.personal_info?.titre}
              </h2>
            </div>
            {profileImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="flex gap-6 text-gray-600 dark:text-gray-300 mt-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{cvData?.personal_info?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{cvData?.personal_info?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{cvData?.personal_info?.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profil
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {cvData?.profil}
        </p>
      </div>

      {/* Experience Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Experience Professionnelle
        </h2>
        {cvData?.experience_professionnelle?.map((exp, index) => (
          <div key={index} className="mb-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-1">
                  {exp.poste}
                </h3>
                <h4 className="text-lg text-gray-700 dark:text-gray-200 mb-1">
                  {exp.entreprise}
                </h4>
              </div>
              <span className="text-sm bg-blue-600 text-white dark:bg-blue-500 px-4 py-1 rounded-full">
                {exp.periode}
              </span>
            </div>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              {exp.realisations?.map((realisation, idx) => (
                <li key={idx} className="pl-2">{realisation}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Compétences
        </h2>
        <div className="grid gap-6">
          {Object.entries(cvData?.competences || {}).map(([category, skills]) => (
            <div key={category} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-gray-800 dark:text-white capitalize mb-4">
                {category.replace('_', ' ')}
              </h3>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(skills) && skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Langues
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(cvData?.personal_info?.languages || {}).map(([lang, level], index) => (
            <div key={index} className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300 block mb-1">{lang}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}