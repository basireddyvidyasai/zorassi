import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="premium-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Enter your credentials to access your dashboard</p>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ margin: 0 }}>Password</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>Forgot password?</span>
            </div>
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
            Sign In
          </button>
          
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <span 
              onClick={onSwitch} 
              style={{ color: 'white', fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid var(--primary)' }}
            >
              Create an account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
