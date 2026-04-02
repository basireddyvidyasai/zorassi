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
      <div className="glass-card auth-box">
        <h1 className="title" style={{ textAlign: 'center' }}>Sign In</h1>
        {error && <p className="text-danger" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="form-control" 
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginBottom: '1rem' }}>Login</button>
          
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <span 
              onClick={onSwitch} 
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
