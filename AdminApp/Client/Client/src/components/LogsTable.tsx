import type { AuthLog } from '../types';
import '../styles/components/LogsTable.css';

interface LogsTableProps {
  logs: AuthLog[];
}

export default function LogsTable({ logs }: LogsTableProps) {
  return (
    <table className="logs-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Timestamp</th>
          <th>Success</th>
          <th>Image Capture</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index}>
            <td>{log.userId}</td>
            <td>{log.timestamp}</td>
            <td>{log.success ? 'Yes' : 'No'}</td>
            <td>
              {log.imageCapture ? (
                <img src={log.imageCapture} width={100} alt="Captured" />
              ) : (
                'No Image'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
