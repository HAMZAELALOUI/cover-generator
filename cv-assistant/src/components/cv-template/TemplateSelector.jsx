import React from 'react';
import { FaImage } from 'react-icons/fa';

const latexTemplates = [
  {
    id: 'modern_cv',
    name: 'ModernCV',
    description: 'Professional LaTeX template with clean design',
    preview: '📄 Modern'
  },
  {
    id: 'awesome_cv',
    name: 'Awesome CV',
    description: 'Stylish and feature-rich template',
    preview: '📑 Awesome'
  },
  {
    id: 'alta_cv',
    name: 'AltaCV',
    description: 'Academic and research-focused design',
    preview: '📋 Alta'
  },
  {
    id: 'classic_cv',
    name: 'Classic CV',
    description: 'Traditional academic curriculum vitae',
    preview: '📜 Classic'
  }
];

export default function TemplateSelector({ 
  currentTemplate, 
  onTemplateChange,
  onStyleChange,
  onImageUpload,
  profileImage 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        Choose LaTeX Template
      </h3>
      
      {/* LaTeX Template Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {latexTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template)}
            className={`p-4 rounded-lg border-2 text-left transition-all
              ${currentTemplate?.id === template.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}
              dark:text-white`}
          >
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md mb-3 flex items-center justify-center text-4xl">
              {template.preview}
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              {template.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {template.description}
            </p>
          </button>
        ))}
      </div>

      {/* LaTeX Customization Options */}
      <div className="space-y-6">
        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {profileImage ? (
              <div className="relative w-20 h-20">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  onClick={() => onImageUpload(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onImageUpload(e.target.files[0]);
                    }
                  }}
                />
                <FaImage className="text-gray-400 dark:text-gray-500 text-xl" />
              </label>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Add a professional photo (optional)
            </span>
          </div>
        </div>

        {/* Document Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Style
          </label>
          <select
            onChange={(e) => onStyleChange({ style: e.target.value })}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="academic">Academic</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        {/* Paper Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paper Size
          </label>
          <select
            onChange={(e) => onStyleChange({ paperSize: e.target.value })}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="a4">A4 (European)</option>
            <option value="letter">Letter (US)</option>
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Size
          </label>
          <select
            onChange={(e) => onStyleChange({ fontSize: e.target.value })}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="10pt">Small (10pt)</option>
            <option value="11pt">Medium (11pt)</option>
            <option value="12pt">Large (12pt)</option>
          </select>
        </div>
      </div>
    </div>
  );
} 