import React from 'react';

export default function CVTemplate({ cvData, template }) {
  if (!cvData) return null;

  const { theme } = template;
  
  const getThemeClasses = () => {
    const classes = {
      container: `bg-white p-8 shadow-lg max-w-4xl mx-auto font-${theme.fontFamily}`,
      header: `text-${theme.primary}-600`,
      section: `mb-6 text-${theme.fontSize}`,
      // ... add more theme classes
    };
    return classes;
  };

  const classes = getThemeClasses();

  const { personal_info, profil, competences, experience_professionnelle, formation, projets } = cvData;

  return (
    <div className={classes.container}>
      {/* Header / Personal Info */}
      <header className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{personal_info.name}</h1>
        <h2 className="text-xl text-blue-600 mb-4">{personal_info.titre}</h2>
        
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {personal_info.email}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {personal_info.phone}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {personal_info.location}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            {personal_info.linkedin}
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Profil</h3>
        <p className="text-gray-600">{profil}</p>
      </section>

      {/* Skills Section */}
      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Compétences</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Techniques</h4>
            <ul className="list-disc list-inside text-gray-600">
              {competences.techniques.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Outils & Technologies</h4>
            <ul className="list-disc list-inside text-gray-600">
              {[...competences.frameworks, ...competences.outils].map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Expérience Professionnelle</h3>
        {experience_professionnelle.map((exp, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-gray-800">{exp.poste}</h4>
            <div className="text-gray-600">
              <p>{exp.entreprise} | {exp.periode}</p>
              <ul className="list-disc list-inside mt-2">
                {exp.realisations.map((realisation, idx) => (
                  <li key={idx}>{realisation}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Formation</h3>
        {formation.map((edu, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-gray-800">{edu.diplome}</h4>
            <p className="text-gray-600">{edu.etablissement}</p>
            <p className="text-gray-600">{edu.periode}</p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              {edu.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Projets</h3>
        {projets.map((projet, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-gray-800">{projet.nom}</h4>
            <p className="text-gray-600 mb-2">{projet.description}</p>
            <div className="flex flex-wrap gap-2">
              {projet.technologies.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Languages */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Langues</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(personal_info.languages).map(([language, level], index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-800">{language}</span>
              <span className="text-gray-600">{level}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 