import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { jobService } from '../../services/api';

export default function JobMatches() {
  const { cvData } = useApp();
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobMatches = useCallback(async () => {
    if (!cvData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching job matches with CV data:', cvData);
      const result = await jobService.searchJobs(cvData);
      console.log('Job matches result:', result);
      setMatches(result);
    } catch (error) {
      console.error('Error fetching job matches:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [cvData]);

  useEffect(() => {
    if (cvData) {
      fetchJobMatches();
    }
  }, [fetchJobMatches]);

  if (!cvData) return null;

  return (
    <Card title="Job Matches">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">
          {error}
          <Button
            onClick={fetchJobMatches}
            variant="secondary"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : matches ? (
        <div className="space-y-6">
          {/* Job Matches Display */}
          <div className="space-y-4">
            {matches.map((match, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{match.title}</h3>
                <p className="text-sm text-gray-600">{match.company}</p>
                <p className="mt-2">{match.description}</p>
                {match.match_score && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Match Score: </span>
                    <span className="text-blue-600">{match.match_score}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No job matches found. Try updating your CV with more details.
        </div>
      )}
    </Card>
  );
}
