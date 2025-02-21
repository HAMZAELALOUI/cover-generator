import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

export default function Generator({ onGenerate }) {
  const { cvData } = useApp();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCoverLetter = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cover-generator-9.onrender.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cv_info: cvData,
          job_analysis: jobDescription,
        }),
      });
      const data = await response.json();
      onGenerate(data.cover_letter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Generate Cover Letter">
      <div className="space-y-4">
        <textarea
          className="w-full h-48 p-2 border rounded-md"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button
          onClick={generateCoverLetter}
          disabled={loading || !jobDescription}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>
      </div>
    </Card>
  );
}
