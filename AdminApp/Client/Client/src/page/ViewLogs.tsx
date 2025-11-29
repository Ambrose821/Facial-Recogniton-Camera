import { useEffect, useState } from 'react';
import getLogs from '../api/GetLogs';
import type { AuthLog } from '../types';
import LogsTable from '../components/LogsTable';
import '../styles/pages/ViewLogs.css';

export default function ViewLogs() {
  const [logs, setLogs] = useState<AuthLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const logs = await getLogs();
      console.log(logs);
      setLogs(logs);
    };

    fetchLogs();
  }, []);

  return (
    <div className="logs-container">
      <h1>Authentication Logs</h1>
      <LogsTable logs={logs} />
    </div>
  );
}
