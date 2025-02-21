import { useApp } from '../context/AppContext';
import Button from '../components/common/Button';
import CVAnalysis from '../components/dashboard/CVAnalysis';
import JobMatches from '../components/dashboard/JobMatches';
import SkillGapChart from '../components/dashboard/SkillGapChart';

export default function Dashboard() {
  const { cvData, setCvData } = useApp();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/generate-cover-letter/cv-extract/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setCvData(data);
    } catch (error) {
      console.error('Error uploading CV:', error);
    }
  };

  return (
    <div className="space-y-6">
      {!cvData ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to CV Assistant
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your CV to get started with personalized job matches and analysis
          </p>
          <label className="cursor-pointer">
            <Button variant="primary">
              Upload CV
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </Button>
          </label>
        </div>
      ) : (
        <>
          <CVAnalysis />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillGapChart />
            <JobMatches />
          </div>
        </>
      )}
    </div>
  );
}
