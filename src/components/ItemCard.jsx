import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './ItemCard.css';

const ItemCard = ({ item, currentUser, onResolve }) => {
  const isOwner = currentUser && item.userId === currentUser.uid;
  const [authorData, setAuthorData] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', item.userId));
        if (userDoc.exists()) {
          setAuthorData(userDoc.data());
        }
      } catch (err) {
        console.error('Error fetching author data:', err);
      } finally {
        setLoadingAuthor(false);
      }
    };

    if (item.userId) {
      fetchAuthorData();
    }
  }, [item.userId]);
  
  return (
    <div className="item-card glass">
      <div className={`status-badge ${item.type}`}>
        {item.type === 'lost' ? 'LOST' : 'FOUND'}
      </div>
      
      {item.imageUrl && (
        <div className="item-image-container">
          <img src={item.imageUrl} alt={item.title} className="item-image" />
        </div>
      )}
      
      <div className="item-details">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-desc">{item.description}</p>
        
        <div className="item-meta">
          <span className="meta-info">📍 {item.location || 'Unknown Location'}</span>
          <span className="meta-info">📅 {item.date || 'Unknown Date'}</span>
        </div>

        {!isOwner && (
          <div className="author-info" style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd'}}>
            <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>Posted by:</p>
            {loadingAuthor ? (
              <p style={{fontSize: '0.9rem', color: '#666'}}>Loading...</p>
            ) : authorData ? (
              <>
                <p style={{marginBottom: '0.3rem'}}><strong>{authorData.firstName} {authorData.lastName}</strong></p>
                <p style={{marginBottom: '0.3rem', fontSize: '0.9rem'}}>📚 {authorData.designation} {authorData.department ? `- ${authorData.department}` : ''}</p>
                {authorData.year && <p style={{marginBottom: '0.3rem', fontSize: '0.9rem'}}>📖 Year: {authorData.year}</p>}
                <p style={{marginBottom: '0rem', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold'}}>📱 {authorData.mobile}</p>
              </>
            ) : (
              <p style={{fontSize: '0.9rem', color: '#666'}}>Author info unavailable</p>
            )}
          </div>
        )}
        
        {isOwner && item.status === 'active' && (
          <div className="item-actions">
            {item.type === 'lost' ? (
              <button 
                className="btn btn-outline" 
                onClick={() => onResolve(item.id)}
              >
                Mark as Found
              </button>
            ) : (
              <button 
                className="btn btn-outline" 
                onClick={() => onResolve(item.id)}
              >
                Handed Over / Remove
              </button>
            )}
          </div>
        )}
        
        {isOwner && item.status === 'resolved' && (
          <div className="item-actions">
            <span style={{ color: 'var(--found-color)', fontWeight: 'bold' }}>Resolved ✓</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
