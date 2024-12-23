const API_BASE_URL = 'http://127.0.0.1:8000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const cvService = {
  extractCV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/extract-cv/`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },

  analyzeJobDescription: async (jobDescription) => {
    const response = await fetch(`${API_BASE_URL}/analyze-job/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_description: jobDescription }),
    });

    return handleResponse(response);
  },

  generateCoverLetter: async (cvData, jobAnalysis, language) => {
    const response = await fetch(`${API_BASE_URL}/generate-cover-letter/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_info: cvData,
        job_analysis: jobAnalysis,
        language: language
      }),
    });
    
    return handleResponse(response);
  },

  analyzeSkillGap: async (cvData, jobDescription) => {
    const response = await fetch(`${API_BASE_URL}/analyze-gap/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_info: cvData,
        job_requirements: jobDescription
      }),
    });
    
    return handleResponse(response);
  },
};
