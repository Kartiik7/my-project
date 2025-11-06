import React, { useState } from 'react';
import useAuth from '../hooks/useAuth'; // Corrigé : import par défaut

const RegisterPage = ({ setPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- Add loading state
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // <-- Set loading true
    try {
      await register(name, email, password);
      setPage('posts'); // Redirect to posts after register
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false); // <-- Set loading false on error
    }
  };

  return (
    <div className="card form-container">
      <h2 className="form-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading} // <-- Disable input while loading
          />
        </div>
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
            minLength={6}
            disabled={isLoading} // <-- Disable input while loading
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}> {/* <-- Disable button on load */}
          {isLoading ? <span className="button-spinner"></span> : 'Register'} {/* <-- Show spinner or text */}
        </button>
        <p className="form-switch-link">
          Already have an account? 
          <span onClick={() => !isLoading && setPage('login')}> {/* <-- Prevent click while loading */}
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
