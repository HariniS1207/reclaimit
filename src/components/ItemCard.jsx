import React from 'react';
import './ItemCard.css';

const ItemCard = ({ item, currentUser, onResolve }) => {
  const isOwner = currentUser && item.userId === currentUser.uid;
  
  return (
    <div className="item-card glass">
      <div className={`status-badge ${item.type}`}>
        {item.type === 'lost' ? 'Lost' : 'Found'}
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
