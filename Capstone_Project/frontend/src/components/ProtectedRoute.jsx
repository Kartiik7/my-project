import React from 'react';
import useAuth from '../hooks/useAuth'; // Corrigé : import par défaut

const ProtectedRoute = ({ children, role, setPage }) => {
  const { user } = useAuth();

  if (user.role !== role) {
    // If user's role doesn't match, redirect
    React.useEffect(() => {
      setPage('posts'); // Redirect to a safe page
    }, [setPage]);

    return (
      <div className="card">
        <h2 className="card-title">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <button className="btn btn-primary" onClick={() => setPage('posts')}>Go to Posts</button>
      </div>
    );
  }

  return children; // If roles match, render the child component
};

export default ProtectedRoute;
