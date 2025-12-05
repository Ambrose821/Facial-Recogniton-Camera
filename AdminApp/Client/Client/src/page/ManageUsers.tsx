import { useEffect, useState } from 'react';
import { listUserIds, deleteFacesByUserId } from '../api/UserManagement';
import '../styles/pages/ManageUsers.css';

export default function ManageUsers() {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busyUser, setBusyUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const ids = await listUserIds();
    setUserIds(ids);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const revokeAccess = async (userId: string) => {
    setBusyUser(userId);
    const ok = await deleteFacesByUserId(userId);
    if (!ok) {
      setError('Failed to revoke access for ' + userId);
    } else {
      // Refresh list after deletion
      await fetchUsers();
    }
    setBusyUser(null);
  };

  return (
    <div className="manage-users-page">
      <div className="header">
        <h2>Manage Users</h2>
        <p className="subtext">Listed from Rekognition collection.</p>
      </div>

      {error && <div className="failure-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-list">
          {userIds.length === 0 ? (
            <div className="empty">No users found.</div>
          ) : (
            userIds.map((id) => (
              <div key={id} className="user-row">
                <div className="user-id">{id}</div>
                <button
                  className="primary-button revoke-button"
                  onClick={() => revokeAccess(id)}
                  disabled={busyUser === id}>
                  {busyUser === id ? 'Revoking...' : 'Revoke Access'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="actions">
        <button className="secondary-button" onClick={fetchUsers} disabled={loading}>
          Refresh List
        </button>
      </div>
    </div>
  );
}
