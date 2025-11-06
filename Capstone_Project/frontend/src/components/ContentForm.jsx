import React, { useState, useEffect } from 'react';

const ContentForm = ({ type, onSubmit, initialData = null, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startTime, setStartTime] = useState(''); // meetings only (datetime-local)
  const [endTime, setEndTime] = useState(''); // meetings only (datetime-local)
  const [localError, setLocalError] = useState('');

  const capitalType = type === 'post' ? 'Post' : 'Meeting';
  const contentType = type === 'post' ? 'Content' : 'Description';
  
  const isEditing = !!initialData;

  const toInputDateTimeLocal = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  useEffect(() => {
    if (isEditing) {
      setTitle(initialData.title);
      setContent(initialData.content || initialData.description || '');
      if (type === 'meeting') {
        setStartTime(toInputDateTimeLocal(initialData.startTime || new Date()));
        setEndTime(toInputDateTimeLocal(initialData.endTime || new Date()));
      }
    } else {
      // defaults for create
      if (type === 'meeting') {
        const now = toInputDateTimeLocal(new Date());
        setStartTime(now);
        setEndTime(now);
      }
    }
  }, [initialData, isEditing, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    let payload;
    if (type === 'post') {
      payload = { title, content };
    } else {
      if (!startTime || !endTime) {
        setLocalError('Please select start and end time.');
        return;
      }
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end < start) {
        setLocalError('End time must be after start time.');
        return;
      }
      payload = {
        title,
        description: content,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      };
    }

    onSubmit(payload);

    // Clear form only if creating
    if (!isEditing) {
      setTitle('');
      setContent('');
      if (type === 'meeting') {
        setStartTime('');
        setEndTime('');
      }
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">{isEditing ? 'Edit' : 'Create New'} {capitalType}</h3>
      <form onSubmit={handleSubmit}>
        {localError && (
          <p className="form-error" style={{ textAlign: 'left', marginBottom: '1rem' }}>{localError}</p>
        )}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">{contentType}</label>
          <textarea
            id="content"
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        {type === 'meeting' && (
          <>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="card-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : `Create ${capitalType}`}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;
