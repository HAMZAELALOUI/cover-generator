import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SkillGapChart() {
  const { cvData } = useApp();
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeSkillGap = async () => {
      if (!cvData) return;
      
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/analyze-skill-gap/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cvData),
        });
        const data = await response.json();
        setGapAnalysis(data);
      } catch (error) {
        console.error('Error analyzing skill gap:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeSkillGap();
  }, [cvData]);

  if (!gapAnalysis) return null;

  const data = {
    labels: gapAnalysis.skills || [],
    datasets: [
      {
        label: 'Current Level',
        data: gapAnalysis.current_levels || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Required Level',
        data: gapAnalysis.required_levels || [],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Skill Gap Analysis',
      },
    },
  };

  return (
    <Card title="Skill Gap Analysis">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="w-full h-[400px]">
          <Bar data={data} options={options} />
        </div>
      )}
    </Card>
  );
}
