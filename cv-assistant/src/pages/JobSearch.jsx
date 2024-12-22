import JobMatches from '../components/dashboard/JobMatches';

export default function JobSearch() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Job Search</h1>
      <JobMatches />
    </div>
  );
}
