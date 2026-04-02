import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/auth', config);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleUpdate = async (id, data) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/auth/${id}`, data, config);
      fetchUsers();
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently? This cannot be undone.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/auth/${id}`, config);
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>User Management</h2>
      {loading ? <p>Loading users...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      className="form-control" 
                      style={{ width: 'auto', padding: '0.25rem' }}
                      value={u.role}
                      onChange={(e) => handleUpdate(u._id, { role: e.target.value })}
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-income' : 'badge-expense'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn" 
                        style={{ 
                          width: 'auto', 
                          padding: '0.25rem 0.5rem', 
                          fontSize: '0.75rem',
                          backgroundColor: u.status === 'active' ? 'var(--danger)' : 'var(--success)',
                          color: 'white'
                        }}
                        onClick={() => handleUpdate(u._id, { status: u.status === 'active' ? 'inactive' : 'active' })}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ 
                          width: 'auto', 
                          padding: '0.25rem 0.5rem', 
                          fontSize: '0.75rem',
                        }}
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
