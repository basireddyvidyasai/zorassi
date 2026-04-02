import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      onRegister(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-box">
        <h1 className="title" style={{ textAlign: 'center' }}>Sign Up</h1>
        {error && <p className="text-danger" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
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
        <button type="submit" className="btn btn-primary" style={{ marginBottom: '1rem' }}>Sign Up</button>
          
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <span 
              onClick={onSwitch} 
              style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
