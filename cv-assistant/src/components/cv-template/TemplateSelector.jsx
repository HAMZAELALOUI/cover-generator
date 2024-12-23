import React from 'react';
import { FaImage } from 'react-icons/fa';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and modern layout with sidebar',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional template for executives',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design for creative professionals',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean design',
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">Choose Template</h3>
      
      {/* Template Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template)}
            className={`p-4 rounded-lg border-2 text-left transition-all
              ${currentTemplate?.id === template.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'}`}
          >
            <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
              <span className="text-gray-400">Template Preview</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
            <p className="text-sm text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>

      {/* Customization Options */}
      <div className="space-y-6">
        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500">
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
                <FaImage className="text-gray-400 text-xl" />
              </label>
            )}
            <span className="text-sm text-gray-500">
              Add a professional photo (optional)
            </span>
          </div>
        </div>

        {/* Color Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Theme
          </label>
          <div className="flex flex-wrap gap-2">
            {['blue', 'green', 'purple', 'red', 'gray'].map((color) => (
              <button
                key={color}
                onClick={() => onStyleChange({ primary: color })}
                className={`w-8 h-8 rounded-full border-2 transition-transform
                  bg-${color}-500 hover:scale-110
                  ${currentTemplate?.theme?.primary === color ? 'border-black scale-110' : 'border-transparent'}`}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* Font Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Style
          </label>
          <select
            onChange={(e) => onStyleChange({ font: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="sans">Modern Sans</option>
            <option value="serif">Classic Serif</option>
            <option value="mono">Professional Mono</option>
          </select>
        </div>
      </div>
    </div>
  );
} 