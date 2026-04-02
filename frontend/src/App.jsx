import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (user && user.token) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const res = await axios.get('http://localhost:5000/api/auth/me', config);
          const updatedUser = { ...user, ...res.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (err) {
          if (err.response?.status === 401) {
            handleLogout();
          }
        }
      }
    };
    syncUser();
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <>
      {!user ? (
        showLogin ? (
          <Login onLogin={handleLogin} onSwitch={() => setShowLogin(false)} />
        ) : (
          <Register onRegister={handleLogin} onSwitch={() => setShowLogin(true)} />
        )
      ) : (
        <Dashboard 
          token={user.token} 
          user={user} 
          onLogout={handleLogout} 
          onUserUpdate={handleUserUpdate} 
        />
      )}
    </>
  );
};

export default App;
