const API_BASE_URL = 'http://127.0.0.1:8000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const cvService = {
  extractCV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file:', file.name);
      
      const response = await fetch(`${API_BASE_URL}/extract-cv/`, {
        method: 'POST',
        body: formData,
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('CV extraction error:', error);
      throw error;
    }
  },

  analyzeJobDescription: async (jobDescription) => {
    const response = await fetch(`${API_BASE_URL}/analyze-job/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDescription }),
    });
    
    return handleResponse(response);
  },

  generateCoverLetter: async (cvData, jobAnalysis, language = 'English') => {
    const response = await fetch(`${API_BASE_URL}/generate-cover-letter/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cv_info: cvData,
        job_analysis: jobAnalysis,
        language: language
      }),
    });

    return handleResponse(response);
  }
};

export const jobService = {
  searchJobs: async (cvData) => {
    try {
      console.log('CV Data received:', cvData);
      
      // Format the data exactly as the backend expects
      // const cvData = {
      //   Name: cvData.personal_info?.name || '',
      //   Skills: Array.isArray(cvData.competences) 
      //     ? cvData.competences 
      //     : Object.values(cvData.competences || {}),
      //   Location: cvData.personal_info?.location || '',
      //   Profile: cvData.profil || '',
      //   "Work Experience": Array.isArray(cvData.experience_professionnelle) 
      //     ? cvData.experience_professionnelle 
      //     : [],
      //   Education: Array.isArray(cvData.education) 
      //     ? cvData.education 
      //     : []
      // };

      console.log('Sending formatted data:', cvData);

      const response = await fetch(`${API_BASE_URL}/find-matches/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }
      console.log('Job search hhhhhh response:', response);
      return response.json();
    } catch (error) {
      console.error('Job search error:', error);
      throw error;
    }
  }
};
