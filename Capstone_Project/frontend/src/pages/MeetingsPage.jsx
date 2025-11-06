import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import ContentCard from '../components/ContentCard';
import ContentForm from '../components/ContentForm';
import LoadingSpinner from '../components/LoadingSpinner';

const MeetingsPage = () => {
  const { user, isAuthLoading } = useAuth(); // FIX: Get isAuthLoading state
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Keep this for data loading
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // stores the item object

  const type = 'meeting';
  const pluralType = 'meetings';
  const capitalType = 'Meeting';

  // Fetch meetings from backend once auth state is known
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/api/meetings');
        const data = res.data?.data || [];
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch ${pluralType}.`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      setIsLoading(false);
      setError('You must be logged in to view meetings.');
      return;
    }

    fetchItems();
  }, [isAuthLoading, user]);

  // --- CRUD Handlers via backend API ---
  const handleSubmit = async (payload) => {
    if (!user) {
      setError("You must be logged in to create or edit a meeting.");
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/api/meetings/${editingItem._id}`, payload);
      } else {
        await api.post('/api/meetings', payload);
      }
      // Refresh list after mutation
      const res = await api.get('/api/meetings');
      const data = res.data?.data || [];
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setItems(data);
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message;
      setError(`Failed to save ${type}. ${msg}`);
    }
  };

  const handleDelete = async (itemId) => {
    // FIX: Use custom modal instead of window.confirm
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
        return;
    }
    try {
      await api.delete(`/api/meetings/${itemId}`);
      // Refresh list after deletion
      const res = await api.get('/api/meetings');
      const data = res.data?.data || [];
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setItems(data);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message;
      setError(`Failed to delete ${type}. ${msg}`);
    }
  };

  // --- Form Toggle Handlers (No change) ---
  const handleShowCreateForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleShowEditForm = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  // --- Permission Check (No change) ---
  const canCreate = user && (user.role === 'Admin' || user.role === 'Editor');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>All {capitalType}s</h2>
        {canCreate && !showForm && (
          <button className="btn btn-primary" onClick={handleShowCreateForm}>
            Create New {capitalType}
          </button>
        )}
      </div>

      {error && <p className="form-error" style={{ textAlign: 'left', marginBottom: '1rem' }}>{error}</p>}

      {showForm && (
        <ContentForm
          type={type}
          onSubmit={handleSubmit}
          initialData={editingItem}
          onCancel={handleCancelForm}
        />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="card empty-state">
          <h3>No {pluralType} found.</h3>
          {/* FIX: Check user exists before checking role */}
          {user && (user.role === 'Admin' || user.role === 'Editor') && !showForm && (
            <p>Get started by creating a new {type}.</p>
          )}
        </div>
      ) : (
        items.map(item => (
          <ContentCard
            key={item._id}
            item={item}
            type={type}
            onEdit={handleShowEditForm}
            onDelete={() => handleDelete(item._id)}
          />
        ))
      )}
    </div>
  );
};

export default MeetingsPage;

