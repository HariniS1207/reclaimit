import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all-lost');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, "items"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(data);
      } catch (err) {
        console.error("Error fetching items", err);
      }
    };

    fetchItems();
  }, []);

  // resolution handler
  const handleResolve = async (itemId) => {
    try {
      await updateDoc(doc(db, "items", itemId), {
        status: "resolved"
      });
      setItems(items.map(item => 
        item.id === itemId ? { ...item, status: 'resolved' } : item
      ));
    } catch (err) {
      console.error("Error resolving item", err);
      alert("Failed to resolve the item.");
    }
  };

  const allLost = items.filter(i => i.type === 'lost' && i.status === 'active');
  const allFound = items.filter(i => i.type === 'found' && i.status === 'active');
  const myLost = items.filter(i => i.type === 'lost' && i.userId === user?.uid);
  const myFound = items.filter(i => i.type === 'found' && i.userId === user?.uid);

  const getActiveList = () => {
    switch(activeTab) {
      case 'all-lost': return allLost;
      case 'all-found': return allFound;
      case 'my-lost': return myLost;
      case 'my-found': return myFound;
      default: return [];
    }
  };

  const activeList = getActiveList();

  return (
    <div className="dashboard">
      <div className="dashboard-header glass">
        <h1>Dashboard</h1>
        <p>Find what you lost, or help others reclaim their items.</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'all-lost' ? 'active' : ''}`} onClick={() => setActiveTab('all-lost')}>All Lost</button>
        <button className={`tab-btn ${activeTab === 'all-found' ? 'active' : ''}`} onClick={() => setActiveTab('all-found')}>All Found</button>
        <button className={`tab-btn ${activeTab === 'my-lost' ? 'active' : ''}`} onClick={() => setActiveTab('my-lost')}>My Lost</button>
        <button className={`tab-btn ${activeTab === 'my-found' ? 'active' : ''}`} onClick={() => setActiveTab('my-found')}>My Found</button>
      </div>

      <div className="items-grid">
        {activeList.length === 0 ? (
          <div className="empty-state glass">
             <h3>No items found in this category.</h3>
          </div>
        ) : (
          activeList.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              currentUser={user ? { uid: user.uid, name: user.email } : { uid: null }} 
              onResolve={handleResolve} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
