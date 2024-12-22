import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';

export default function Profile() {
  const { cvData } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <Card>
        {cvData ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-gray-600">{cvData.Name}</p>
              <p className="text-gray-600">{cvData.Location}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Skills</h2>
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
          </div>
        ) : (
          <p className="text-gray-600">Please upload your CV to view your profile</p>
        )}
      </Card>
    </div>
  );
}
