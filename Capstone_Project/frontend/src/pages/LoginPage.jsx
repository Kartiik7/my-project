import React, { useState } from 'react';
import useAuth from '../hooks/useAuth'; // Corrigé : import par défaut (sans accolades)

const LoginPage = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- Add loading state
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // <-- Set loading true
    try {
      await login(email, password);
      setPage('posts'); // Redirect to posts after login
      // No need to set isLoading(false) here, component unmounts
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false); // <-- Set loading false on error
    }
  };

  return (
    <div className="card form-container">
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading} // <-- Disable input while loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading} // <-- Disable input while loading
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}> {/* <-- Disable button on load */}
          {isLoading ? <span className="button-spinner"></span> : 'Login'} {/* <-- Show spinner or text */}
        </button>
        <p className="form-switch-link">
          Don't have an account? 
          <span onClick={() => !isLoading && setPage('register')}> {/* <-- Prevent click while loading */}
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
