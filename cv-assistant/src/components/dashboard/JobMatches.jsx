import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { jobService } from '../../services/api';
import { ChevronDownIcon, ChevronUpIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function JobMatches() {
  const { cvData } = useApp();
  const [matchesData, setMatchesData] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobMatches = useCallback(async () => {
    if (!cvData) return;

    setLoading(true);
    setError(null);

    try {
      const result = await jobService.searchJobs(cvData);
      console.log('Job matches result:', result);
      setMatchesData(result?.matches || null);
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

  if (loading) {
    return (
      <Card title="Job Matches">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Job Matches">
        <div className="text-red-500 text-center py-4">
          {error}
          <Button onClick={fetchJobMatches} variant="secondary" className="mt-2">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!matchesData) {
    return (
      <Card title="Job Matches">
        <div className="text-center py-8 text-gray-500">
          No job matches found. Try updating your CV with more details.
        </div>
      </Card>
    );
  }

  const { candidate_name, location, cv_analysis, job_search_resources, worldwide_opportunities } = matchesData;

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card title="Profile Summary">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{candidate_name}</h3>
          <p className="text-gray-600 mb-4">{location}</p>

          {/* Primary Roles */}
          {cv_analysis?.primary_roles?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Primary Roles</h4>
              <div className="flex flex-wrap gap-2">
                {cv_analysis.primary_roles.map((role, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Skills */}
          {cv_analysis?.key_skills?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {cv_analysis.key_skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Job Search Resources */}
      {job_search_resources?.search_links_by_title?.length > 0 && (
        <Card title="Job Search Resources">
          <div className="p-4">
            {job_search_resources.search_links_by_title.map((roleData, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => setSelectedRole(selectedRole === index ? null : index)}
                  className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="font-medium text-green-700">{roleData.job_title}</span>
                  {selectedRole === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {selectedRole === index && (
                  <div className="mt-2 ml-4 space-y-2">
                    {Object.entries(roleData.search_links).map(([platform, links]) => (
                      <div key={platform} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-24">{platform}:</span>
                        {Array.isArray(links) ? (
                          links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-5"
                            >
                              {link.location} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                          ))
                        ) : (
                          <a href={links} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm pl-5">
                            View Jobs
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
