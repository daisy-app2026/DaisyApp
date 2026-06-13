import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';
import styles from './Users.module.css';

interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  language: string;
  streak: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states for delete confirmation
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data.users);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user directory. Verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteUser(userToDelete.uid);
      
      // Remove deleted user locally
      setUsers(users.filter(u => u.uid !== userToDelete.uid));
      setShowConfirmModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError('Failed to delete user. Make sure user exists.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading user directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>{error}</p>
        <button onClick={fetchUsers} className={styles.retryButton}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Users</h1>
          <p className={styles.subtext}>View streaks, creation dates, and manage active accounts.</p>
        </div>
        <button onClick={fetchUsers} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Streak</th>
                <th>Language</th>
                <th className={styles.textRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyCell}>
                    No registered users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className={styles.userName}>{user.name || 'Anonymous User'}</span>
                      </div>
                    </td>
                    <td><span className={styles.userEmail}>{user.email}</span></td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={styles.streakBadge}>
                        🔥 {user.streak}
                      </span>
                    </td>
                    <td>
                      <span className={styles.langBadge}>{user.language.toUpperCase()}</span>
                    </td>
                    <td className={styles.textRight}>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className={styles.deleteButton}
                        title="Delete User Account"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && userToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm User Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to permanently delete user <strong>{userToDelete.name || userToDelete.email}</strong>?
              This will remove their profile from the database and invalidate their authentication tokens.
            </p>
            {deleteError && <p className={styles.deleteErrorText}>{deleteError}</p>}
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={styles.cancelButton}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={styles.confirmDeleteButton}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
