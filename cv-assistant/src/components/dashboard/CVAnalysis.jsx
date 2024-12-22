import { useApp } from '../../context/AppContext';
import Card from '../common/Card';

export default function CVAnalysis() {
  const { cvData } = useApp();

  if (!cvData) return null;

  return (
    <Card title="CV Analysis">
      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-900">{cvData.Name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-gray-900">{cvData.Location}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {cvData.Skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Experience</h3>
          <div className="space-y-4">
            {cvData.Experience?.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}