import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import RecordForm from './RecordForm';
import UserManagement from './UserManagement';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const Dashboard = ({ token, user, onLogout, onUserUpdate }) => {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ type: '', category: '', search: '', sort: 'desc' });
  const [editingRecord, setEditingRecord] = useState(null);
  const [view, setView] = useState(user.role === 'Viewer' ? 'analytics' : 'records'); // 'records', 'analytics', or 'users'

  const categories = [
    'Salary', 'Food', 'Rent', 'Utilities', 'Entertainment', 
    'Transport', 'Healthcare', 'Shopping', 'Investment', 'Other'
  ];

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const sumRes = await axios.get('http://localhost:5000/api/dashboard/summary', config);
      setSummary(sumRes.data);
      
      // Auto-sync user role/status if backend reports a change
      if (sumRes.data.currentUser) {
        const { role, status, name } = sumRes.data.currentUser;
        if (role !== user.role || status !== user.status || name !== user.name) {
          onUserUpdate({ role, status, name });
        }
      }

      if (user.role !== 'Viewer') {
        const query = new URLSearchParams({ ...filters, page }).toString();
        console.log('Fetching records with query:', query);
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
    // Background polling for role/status changes and live data updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
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
        
        <div className="nav-bar">
          {user.role !== 'Viewer' && (
            <button 
              className={`nav-link ${view === 'records' ? 'active' : ''}`}
              onClick={() => setView('records')}
            >
              Dashboard
            </button>
          )}
          <button 
            className={`nav-link ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            Analytics
          </button>
          {user.role === 'Admin' && (
            <button 
              className={`nav-link ${view === 'users' ? 'active' : ''}`}
              onClick={() => setView('users')}
            >
              Manage Users
            </button>
          )}
        </div>

        <button onClick={onLogout} className="btn btn-primary" style={{ width: 'auto' }}>Logout</button>
      </header>

      {view === 'analytics' && summary && (
        <div key="analytics-view" style={{ animation: 'slideUp 0.4s ease' }}>
          <div className="stats-grid">
            <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
              <span className="stat-label">Total Income</span>
              <span className="stat-value text-success">${summary.totalIncome.toLocaleString()}</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                +{((summary.totalIncome / (summary.totalExpenses || 1)) * 10).toFixed(1)}% vs expenses
              </div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <span className="stat-label">Total Expenses</span>
              <span className="stat-value text-danger">${summary.totalExpenses.toLocaleString()}</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {((summary.totalExpenses / (summary.totalIncome || 1)) * 100).toFixed(1)}% of income
              </div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <span className="stat-label">Net Balance</span>
              <span className="stat-value text-primary">${summary.netBalance.toLocaleString()}</span>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Current liquid assets
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Category Allocation</h3>
              <div className="chart-container">
                <Doughnut 
                  data={{
                    labels: Object.keys(summary.categoryTotals),
                    datasets: [{
                      data: Object.values(summary.categoryTotals),
                      backgroundColor: [
                        '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
                        '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#64748b'
                      ],
                      borderWidth: 0,
                      hoverOffset: 15
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true, padding: 15 }
                      }
                    },
                    cutout: '70%'
                  }}
                />
              </div>
            </div>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Monthly Performance</h3>
              <div className="chart-container">
                <Bar 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Income',
                        data: [...new Array(12)].map((_, i) => {
                          const monthData = (summary.monthlyTrends || []).find(t => t._id.month === i + 1 && t._id.type === 'income');
                          return monthData ? monthData.total : 0;
                        }),
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderRadius: 4
                      },
                      {
                        label: 'Expense',
                        data: [...new Array(12)].map((_, i) => {
                          const monthData = (summary.monthlyTrends || []).find(t => t._id.month === i + 1 && t._id.type === 'expense');
                          return monthData ? monthData.total : 0;
                        }),
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        borderRadius: 4
                      }
                    ]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top', labels: { color: '#94a3b8', boxWidth: 12, usePointStyle: true } }
                    },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: '#64748b' } },
                      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'records' && (
        <div key="records-view" style={{ animation: 'slideUp 0.4s ease' }}>
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
                    <option value="desc">Sort by Date (Newest)</option>
                    <option value="asc">Sort by Date (Oldest)</option>
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
        </div>
      )}

      {view === 'users' && user.role === 'Admin' && (
        <div key="users-view" style={{ animation: 'slideUp 0.4s ease' }}>
          <UserManagement token={token} currentUser={user} onUserUpdate={onUserUpdate} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
