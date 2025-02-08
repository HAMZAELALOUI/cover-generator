import React from 'react';

export default function EditSection({ onEdit, className = '' }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit button clicked'); // Debug log
    if (onEdit && typeof onEdit === 'function') {
      onEdit();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md
        hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 
        hover:text-gray-800 dark:hover:text-white 
        opacity-0 group-hover:opacity-100 transition-opacity z-10 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
} 