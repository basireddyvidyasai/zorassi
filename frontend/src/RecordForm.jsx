import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecordForm = ({ token, onRecordAdded, editingRecord, onCancelEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        amount: editingRecord.amount,
        type: editingRecord.type,
        category: editingRecord.category,
        date: new Date(editingRecord.date).toISOString().split('T')[0],
        notes: editingRecord.notes || ''
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingRecord) {
        await onUpdate(editingRecord._id, formData);
      } else {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post('http://localhost:5000/api/records', formData, config);
        setFormData({
          amount: '',
          type: 'expense',
          category: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        onRecordAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Salary', 'Food', 'Rent', 'Utilities', 'Entertainment', 
    'Transport', 'Healthcare', 'Shopping', 'Investment', 'Other'
  ];

  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>{editingRecord ? 'Edit Entry' : 'Add New Entry'}</h2>
      {error && <p className="text-danger" style={{ marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label>Amount</label>
          <input 
            type="number" 
            name="amount"
            className="form-control" 
            value={formData.amount}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select 
            name="category" 
            className="form-control" 
            value={formData.category} 
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            name="date"
            className="form-control" 
            value={formData.date}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Notes (Optional)</label>
          <input 
            type="text" 
            name="notes"
            className="form-control" 
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : editingRecord ? 'Update Record' : 'Add Record'}
          </button>
          {editingRecord && (
            <button type="button" onClick={onCancelEdit} className="btn" style={{ backgroundColor: 'var(--border)', color: 'white', width: 'auto' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecordForm;
