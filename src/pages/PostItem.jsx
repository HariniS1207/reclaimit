import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImage } from '../utils/cloudinary';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './PostItem.css';const PostItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    location: '',
    date: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to post an item.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      let imageUrl = '';
      if (formData.file) {
        imageUrl = await uploadImage(formData.file);
      }

      await addDoc(collection(db, 'items'), {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        imageUrl: imageUrl,
        userId: user.uid,
        status: 'active',
        createdAt: serverTimestamp()
      });

      alert('Item submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Error submitting item:", err);
      alert('Failed to submit item: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-item-container">
      <div className="post-item-card glass">
        <h2>Post an Item</h2>
        <p>Did you lose something or find something? Let the community know.</p>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group type-selector">
            <label>Item Type</label>
            <div className="radio-group">
              <label className={`radio-label ${formData.type === 'lost' ? 'active lost' : ''}`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="lost" 
                  checked={formData.type === 'lost'} 
                  onChange={handleChange} 
                />
                Lost an Item
              </label>
              <label className={`radio-label ${formData.type === 'found' ? 'active found' : ''}`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="found" 
                  checked={formData.type === 'found'} 
                  onChange={handleChange} 
                />
                Found an Item
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="e.g. Blue NorthFace Backpack" 
              required 
              value={formData.title} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                placeholder="Where was it lost/found?" 
                required 
                value={formData.location} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                required 
                value={formData.date} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows="4" 
              placeholder="Provide more details to help identify the item." 
              required 
              value={formData.description} 
              onChange={handleChange} 
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image Attachment</label>
            <input 
              type="file" 
              id="image" 
              name="image" 
              accept="image/*" 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
