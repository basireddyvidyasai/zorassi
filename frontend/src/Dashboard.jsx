import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecordForm from './RecordForm';
import UserManagement from './UserManagement';

const Dashboard = ({ token, user, onLogout }) => {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ type: '', category: '', search: '', sort: 'desc' });
  const [editingRecord, setEditingRecord] = useState(null);
  const [view, setView] = useState('records'); // 'records' or 'users'

  const categories = [
    'Salary', 'Food', 'Rent', 'Utilities', 'Entertainment', 
    'Transport', 'Healthcare', 'Shopping', 'Investment', 'Other'
  ];

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sumRes = await axios.get('http://localhost:5000/api/dashboard/summary', config);
      setSummary(sumRes.data);
      if (user.role !== 'Viewer') {
        const query = new URLSearchParams({ ...filters, page }).toString();
        const recRes = await axios.get(`http://localhost:5000/api/records?${query}`, config);
        setRecords(recRes.data.records);
        setTotalPages(recRes.data.pages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user, filters, page]);

  // Rest of the component...
  // (Search input and Pagination UI below)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/records/${id}`, config);
      alert('Record deleted successfully');
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/records/${id}`, updatedData, config);
      setEditingRecord(null);
      fetchData();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title" style={{ marginBottom: 0 }}>Finance Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name} ({user.role})</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user.role === 'Admin' && (
            <button 
              onClick={() => setView(view === 'records' ? 'users' : 'records')} 
              className="btn" 
              style={{ width: 'auto', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'white' }}
            >
              {view === 'records' ? 'Manage Users' : 'Manage Records'}
            </button>
          )}
          <button onClick={onLogout} className="btn btn-primary" style={{ width: 'auto' }}>Logout</button>
        </div>
      </header>

      {summary && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Income</span>
              <span className="stat-value text-success">${summary.totalIncome.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Expenses</span>
              <span className="stat-value text-danger">${summary.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Net Balance</span>
              <span className="stat-value text-primary">${summary.netBalance.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem' }}>Category Breakdown</h3>
              {Object.entries(summary.categoryTotals).map(([cat, val]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{cat}</span>
                  <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span>
                </div>
              ))}
              {Object.keys(summary.categoryTotals).length === 0 && <p className="text-muted">No data yet</p>}
            </div>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem' }}>Monthly Trends ({new Date().getFullYear()})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[...new Array(12)].map((_, i) => {
                  const monthNum = i + 1;
                  const monthData = (summary.monthlyTrends || []).filter(t => t._id.month === monthNum);
                  const inc = monthData.find(d => d._id.type === 'income')?.total || 0;
                  const exp = monthData.find(d => d._id.type === 'expense')?.total || 0;
                  if (inc === 0 && exp === 0) return null;
                  return (
                    <div key={monthNum} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        {new Date(0, i).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                        <span className="text-success">In: ${inc.toLocaleString()}</span>
                        <span className="text-danger">Out: ${exp.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
                {(!summary.monthlyTrends || summary.monthlyTrends.length === 0) && <p className="text-muted">No trend data yet</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'users' && user.role === 'Admin' ? (
        <UserManagement token={token} />
      ) : (
        <>
          {user.role === 'Admin' && (
            <RecordForm 
              token={token} 
              onRecordAdded={fetchData} 
              editingRecord={editingRecord}
              onCancelEdit={() => setEditingRecord(null)}
              onUpdate={handleUpdate}
            />
          )}

          {user.role !== 'Viewer' && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>Financial Records</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    className="form-control" 
                    style={{ width: '180px' }}
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                  <select 
                    className="form-control" 
                    style={{ width: 'auto' }}
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select 
                    className="form-control" 
                    style={{ width: 'auto' }}
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select 
                    className="form-control" 
                    style={{ width: 'auto' }}
                    value={filters.sort}
                    onChange={(e) => setFilters({...filters, sort: e.target.value})}
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Notes</th>
                      {user.role === 'Admin' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={user.role === 'Admin' ? 6 : 5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      records.map(rec => (
                        <tr key={rec._id}>
                          <td>{new Date(rec.date).toLocaleDateString()}</td>
                          <td>{rec.category}</td>
                          <td>
                            <span className={`badge ${rec.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                              {rec.type}
                            </span>
                          </td>
                          <td>${rec.amount.toLocaleString()}</td>
                          <td>{rec.notes}</td>
                          {user.role === 'Admin' && (
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={() => setEditingRecord(rec)} 
                                  className="btn btn-primary" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto', backgroundColor: '#6366f1' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(rec._id)} 
                                  className="btn btn-danger" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem 0' }}>
                <button 
                  className="btn" 
                  style={{ width: 'auto', backgroundColor: 'var(--border)', color: 'white' }}
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span style={{ color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  className="btn" 
                  style={{ width: 'auto', backgroundColor: 'var(--border)', color: 'white' }}
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
