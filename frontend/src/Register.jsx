import React, { useState } from 'react';
import api from './api';

const Register = ({ onRegister, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      onRegister(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="premium-card">
        <h1 className="auth-title">Join Us</h1>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', height: '48px', fontSize: '1.1rem' }}>
            Create Account
          </button>
          
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <span 
              onClick={onSwitch} 
              style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign in instead
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
