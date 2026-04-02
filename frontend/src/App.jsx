import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
        <Dashboard token={user.token} user={{ name: user.name, role: user.role }} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
