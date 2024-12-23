import React from 'react';
import Modal from '../common/Modal';

export default function StyleEditor({ isOpen, onClose, theme, onThemeChange }) {
  console.log('StyleEditor rendered, isOpen:', isOpen); // Debug log

  const fonts = [
    { id: 'sans', name: 'Modern Sans' },
    { id: 'serif', name: 'Classic Serif' },
    { id: 'mono', name: 'Professional Mono' }
  ];

  const fontSizes = [
    { id: 'sm', name: 'Small' },
    { id: 'base', name: 'Medium' },
    { id: 'lg', name: 'Large' }
  ];

  const colors = [
    { id: 'blue', name: 'Blue' },
    { id: 'green', name: 'Green' },
    { id: 'red', name: 'Red' },
    { id: 'purple', name: 'Purple' },
    { id: 'pink', name: 'Pink' }
  ];

  const backgrounds = [
    { id: 'white', name: 'White' },
    { id: 'gray-50', name: 'Light Gray' },
    { id: 'gray-100', name: 'Gray' },
    { id: 'blue-50', name: 'Light Blue' }
  ];

  const handleThemeChange = (key, value) => {
    console.log('Theme change:', key, value); // Debug log
    onThemeChange({ ...theme, [key]: value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Style"
    >
      <div className="space-y-6 p-4">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <select
            value={theme.font}
            onChange={(e) => handleThemeChange('font', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {fonts.map(font => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <select
            value={theme.fontSize}
            onChange={(e) => handleThemeChange('fontSize', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {fontSizes.map(size => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => handleThemeChange('primary', color.id)}
                className={`w-10 h-10 rounded-full border-2 transition-transform
                  bg-${color.id}-500 hover:scale-110
                  ${theme.primary === color.id ? 'border-black scale-110' : 'border-transparent'}`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {backgrounds.map(bg => (
              <button
                key={bg.id}
                onClick={() => handleThemeChange('background', bg.id)}
                className={`w-10 h-10 rounded border-2 transition-transform
                  bg-${bg.id} hover:scale-110
                  ${theme.background === bg.id ? 'border-black scale-110' : 'border-transparent'}`}
                title={bg.name}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Background */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sidebar Background
          </label>
          <div className="grid grid-cols-4 gap-2">
            {backgrounds.map(bg => (
              <button
                key={bg.id}
                onClick={() => handleThemeChange('sidebarBg', bg.id)}
                className={`w-10 h-10 rounded border-2 transition-transform
                  bg-${bg.id} hover:scale-110
                  ${theme.sidebarBg === bg.id ? 'border-black scale-110' : 'border-transparent'}`}
                title={bg.name}
              />
            ))}
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
} 