import React from 'react';
import useAuth from '../hooks/useAuth.js'; // Corrigé : import par défaut (sans accolades)

const Header = ({ setPage }) => {
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    setPage('login'); // Redirect to login after logout
  };

  return (
    <header className="app-header">
      <nav className="nav app-container">
        <div className="nav-left">
          <span className="nav-logo" onClick={() => setPage(user ? 'posts' : 'login')}>RBAC App</span>
          {user && (
            <>
              <span className="nav-link" onClick={() => setPage('posts')}>Posts</span>
              <span className="nav-link" onClick={() => setPage('meetings')}>Meetings</span>
              {user.role === 'Admin' && (
                <span className="nav-link" onClick={() => setPage('admin')}>Admin Panel</span>
              )}
            </>
          )}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name} ({user.role})</span>
              <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <span className="nav-link" onClick={() => setPage('login')}>Login</span>
              <span className="nav-link" onClick={() => setPage('register')}>Register</span>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
