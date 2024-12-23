import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditModal({ isOpen, section, data, onClose, onSave }) {
  const [editedData, setEditedData] = useState(data);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const renderFields = () => {
    console.log('Rendering fields for section:', section, 'with data:', editedData);

    switch (section) {
      case 'personal_info':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={editedData?.name || ''}
              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Name"
            />
            <input
              type="text"
              value={editedData?.titre || ''}
              onChange={(e) => setEditedData({ ...editedData, titre: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Title"
            />
            <input
              type="email"
              value={editedData?.email || ''}
              onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Email"
            />
            <input
              type="tel"
              value={editedData?.phone || ''}
              onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Phone"
            />
            <input
              type="text"
              value={editedData?.location || ''}
              onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Location"
            />
          </div>
        );

      case 'profile':
        return (
          <textarea
            value={editedData || ''}
            onChange={(e) => setEditedData(e.target.value)}
            className="w-full p-2 border rounded h-40"
            placeholder="Profile description"
          />
        );

      case 'competences':
        return (
          <div className="space-y-4">
            {editedData?.techniques?.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...editedData.techniques];
                    newSkills[index] = e.target.value;
                    setEditedData({ ...editedData, techniques: newSkills });
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => {
                    const newSkills = editedData.techniques.filter((_, i) => i !== index);
                    setEditedData({ ...editedData, techniques: newSkills });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setEditedData({
                  ...editedData,
                  techniques: [...(editedData.techniques || []), '']
                });
              }}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Add Skill
            </button>
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-4">
            {Object.entries(editedData || {}).map(([lang, level], index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={lang}
                  onChange={(e) => {
                    const newLangs = { ...editedData };
                    delete newLangs[lang];
                    newLangs[e.target.value] = level;
                    setEditedData(newLangs);
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Language"
                />
                <input
                  type="text"
                  value={level}
                  onChange={(e) => {
                    setEditedData({
                      ...editedData,
                      [lang]: e.target.value
                    });
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Level"
                />
                <button
                  onClick={() => {
                    const newLangs = { ...editedData };
                    delete newLangs[lang];
                    setEditedData(newLangs);
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setEditedData({
                  ...editedData,
                  'New Language': 'Level'
                });
              }}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Add Language
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${section.replace('_', ' ').charAt(0).toUpperCase() + section.slice(1)}`}
    >
      <div className="p-4">
        {renderFields()}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
} 