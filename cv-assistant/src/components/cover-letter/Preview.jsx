import Card from '../common/Card';
import Button from '../common/Button';

export default function Preview({ content }) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card title="Preview">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md whitespace-pre-wrap text-gray-900 dark:text-gray-100">
          {content}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleDownload} variant="primary">
            Download Cover Letter
          </Button>
        </div>
      </div>
    </Card>
  );
}
