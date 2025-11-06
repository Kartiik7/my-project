import React from 'react';

const NotFoundPage = ({ setPage }) => {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 className="card-title">404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <br />
      <button className="btn btn-primary" onClick={() => setPage('posts')}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
