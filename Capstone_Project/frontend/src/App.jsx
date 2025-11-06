import React, { useState, useEffect } from 'react';
import useAuth from './hooks/useAuth'; // Corrigé : import par défaut
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsPage from './pages/PostsPage';
import MeetingsPage from './pages/MeetingsPage';
import AdminPanel from './pages/AdminPanel';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [page, setPage] = useState('login');
  const { user, isAuthLoading } = useAuth();

  // Effect to handle initial page load and auth redirects
  useEffect(() => {
    if (!isAuthLoading) {
      if (user) {
        // If user is loaded and authenticated, default to posts page
        // (or stay on current page if it's valid)
        const validPages = ['posts', 'meetings', 'admin'];
        if (validPages.includes(page)) {
          // If already on a valid page, stay there
          // especially if they clicked 'admin' and are an admin
          if(page === 'admin' && user.role !== 'Admin') {
            setPage('posts'); // fallback for non-admin on admin page
          }
        } else {
          setPage('posts');
        }
      } else {
        // If no user and not on register, force login
        if (page !== 'register') {
          setPage('login');
        }
      }
    }
  }, [user, isAuthLoading, page]); // Rerun when auth state or page changes

  // Helper function to render the current page
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'register':
        return <RegisterPage setPage={setPage} />;
      case 'posts':
        // Everyone can see posts (assuming public route on backend)
        return <PostsPage />;
      case 'meetings':
        // Everyone can see meetings (assuming public route on backend)
        return <MeetingsPage />;
      case 'admin':
        // Use ProtectedRoute to guard the Admin Panel
        return (
          <ProtectedRoute role="Admin">
            <AdminPanel />
          </ProtectedRoute>
        );
      default:
        return <NotFoundPage />;
    }
  };

  // Show loading spinner while AuthContext is checking token
  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {/* Pass setPage to Header so it can change pages */}
      <Header setPage={setPage} />
      <main className="app-container">
        {/* Render the active page */}
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
