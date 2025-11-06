import React from 'react';
import useAuth from '../hooks/useAuth'; // Default import

// Reusable card for displaying a Post or Meeting
const ContentCard = ({ item, type, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  // 1. Handle both `author` (from posts) and `creator` (from meetings)
  const { title, content, description, author, creator, createdAt } = item;
  const itemAuthor = author || creator; // Use author if it exists, otherwise use creator

  // 3. Check for modification rights
  // An Admin can modify anything.
  // An Editor can modify if their ID (user.id) matches the item's author/creator ID.
  const canModify =
    user && itemAuthor && (user.role === 'Admin' || (user.role === 'Editor' && itemAuthor._id === user.id));

  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-meta">
        {/* 2. Display the author/creator's name */}
        <span>By {itemAuthor ? itemAuthor.name : 'Unknown'}</span> |{' '}
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <p className="card-content">{content || description}</p>
      
      {/* Only show actions if the user can modify the content */}
      {canModify && (
        <div className="card-actions">
          <button className="btn btn-warn-outline" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button className="btn btn-danger-outline" onClick={() => onDelete(item._id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentCard;

