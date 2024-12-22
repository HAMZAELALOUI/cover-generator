import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';

export default function JobMatches() {
  const { cvData } = useApp();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobMatches = useCallback(async () => {
    if (!cvData) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/job-matches/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });
      const data = await response.json();
      setMatches(data.jobs || []);
    } catch (error) {
      console.error('Error fetching job matches:', error);
    } finally {
      setLoading(false);
    }
  }, [cvData]);

  useEffect(() => {
    fetchJobMatches();
  }, [fetchJobMatches]);

  if (!matches.length && !loading) return null;

  return (
    <Card title="Job Matches">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((job, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {job.match_score}% Match
                </span>
              </div>
              <p className="mt-2 text-gray-700 line-clamp-2">{job.description}</p>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => window.open(job.url, '_blank')}>
                  Apply Now
                </Button>
                <Button variant="secondary">Save Job</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
