import React from 'react';
import BaseTemplate from './BaseTemplate';
import EditSection from '../../common/EditSection';

export default function CreativeTemplate({ 
  cvData, 
  theme,
  profileImage,
  onEditSection,
  onThemeChange,
  onStyleEdit
}) {
  return (
    <BaseTemplate
      cvData={cvData}
      theme={theme}
      onStyleEdit={onStyleEdit}
    >
      <div className="h-full">
        {/* Header */}
        <header className={`bg-${theme.primary}-600 text-white p-8 relative group`}>
          <EditSection onEdit={() => onEditSection('personal_info')} className="text-white" />
          <div className="flex items-center gap-8">
            {profileImage && (
              <img
                src={profileImage}
                alt={cvData.personal_info.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{cvData.personal_info.name}</h1>
              <p className="text-xl opacity-90">{cvData.personal_info.titre}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 p-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {/* Contact Info */}
            <div className="relative group">
              <EditSection onEdit={() => onEditSection('personal_info')} />
              {/* ... contact info content ... */}
            </div>

            {/* Skills */}
            <div className="relative group">
              <EditSection onEdit={() => onEditSection('competences')} />
              {/* ... skills content ... */}
            </div>

            {/* Languages */}
            <div className="relative group">
              <EditSection onEdit={() => onEditSection('languages')} />
              {/* ... languages content ... */}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-6">
            {/* Profile */}
            <div className="relative group">
              <EditSection onEdit={() => onEditSection('profile')} />
              {/* ... profile content ... */}
            </div>

            {/* Experience */}
            <div className="relative group">
              <EditSection onEdit={() => onEditSection('experience')} />
              {/* ... experience content ... */}
            </div>

            {/* Projects */}
            <div className="relative group">
              <EditSection onEdit={() => onEditSection('projects')} />
              {/* ... projects content ... */}
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
} 