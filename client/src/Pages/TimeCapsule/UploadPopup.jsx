import React, { useState } from 'react';
import './UploadPopup.css';

export default function UploadPopup({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    image: null,
    title: '',
    geolocation: '',
    description: '',
    unlockDate: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost/user/uploadTimecapsule', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        alert('Time capsule uploaded successfully!');
        onUpload();
        onClose();
      } else {
        alert('Failed to upload time capsule');
      }
    } catch (error) {
      console.error('Error uploading time capsule:', error);
      alert('An error occurred while uploading the time capsule');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-popup-overlay">
      <div className="upload-popup">
        <h2>Create New Time Capsule</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="geolocation">Geolocation:</label>
            <input
              type="text"
              id="geolocation"
              name="geolocation"
              value={formData.geolocation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="unlockDate">Unlock Date:</label>
            <input
              type="date"
              id="unlockDate"
              name="unlockDate"
              value={formData.unlockDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">Create Time Capsule</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

