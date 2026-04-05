import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadImage } from '../utils/cloudinary';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data);
            setFormData(data);
          }
        } catch (error) {
          console.error("Error fetching profile", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="glass" style={{padding: '3rem', maxWidth: '400px', margin: '2rem auto', textAlign: 'center'}}>
        <h2>Not logged in</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDirectImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const profileUrl = await uploadImage(file);
      await updateDoc(doc(db, 'users', user.uid), { profileUrl });
      
      const updatedData = { ...profileData, profileUrl };
      setProfileData(updatedData);
      setFormData(updatedData);
    } catch (err) {
      console.error("Failed to upload image directly", err);
      alert("Failed to upload profile picture");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = { ...formData, profileUrl: profileData?.profileUrl || '' };
      await updateDoc(doc(db, 'users', user.uid), updatedData);
      
      setProfileData(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' };

  return (
    <div className="glass" style={{padding: '3rem', maxWidth: '500px', margin: '2rem auto', textAlign: 'left'}}>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          {profileData?.profileUrl ? (
            <img src={profileData.profileUrl} alt="Profile" style={{width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)'}} />
          ) : (
            <div style={{fontSize: '5rem', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#f0f0f0', margin: '0 auto'}}>👤</div>
          )}
          
          <button 
            title="Edit Profile Picture"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              position: 'absolute', 
              bottom: '5px', 
              right: '0px', 
              background: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '35px', 
              height: '35px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            ✏️
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleDirectImageUpload} 
            style={{display: 'none'}} 
          />
        </div>
        
        {imageUploading && <p style={{fontSize: '0.8rem', color: 'var(--primary-color)', marginTop: '5px'}}>Uploading image...</p>}

        <h2 style={{marginTop: '1rem'}}>{profileData?.firstName ? `${profileData.firstName} ${profileData.lastName}` : user.email}</h2>
        <p style={{color: '#333', fontWeight: 'bold', fontSize: '1.2rem'}}>{profileData?.designation || 'User'}</p>
      </div>

      {loading ? (
        <p style={{textAlign: 'center'}}>Loading profile data...</p>
      ) : (
        <div style={{background: 'rgba(255,255,255,0.7)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', lineHeight: '1.8'}}>
          {!isEditing ? (
            <>
              <p><strong>Email:</strong> {user.email}</p>
              {profileData && (
                <>
                  <p><strong>Department:</strong> {profileData.department}</p>
                  {profileData.designation === 'Student' && (
                    <>
                      <p><strong>Year:</strong> {profileData.year}</p>
                      <p><strong>Register Number:</strong> {profileData.registerNumber}</p>
                    </>
                  )}
                  <p><strong>Mobile:</strong> {profileData.mobile}</p>
                </>
              )}
              <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
              </div>
            </>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flex: 1}}>
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{flex: 1}}>
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <label>Department</label>
              <select name="department" value={formData.department || ''} onChange={handleChange} style={inputStyle}>
                <option value="CSE">CSE</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="AIDS">AIDS</option>
                <option value="IT">IT</option>
              </select>

              {profileData?.designation === 'Student' && (
                <div style={{display: 'flex', gap: '10px'}}>
                  <div style={{flex: 1}}>
                    <label>Year</label>
                    <select name="year" value={formData.year || ''} onChange={handleChange} style={inputStyle}>
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </select>
                  </div>
                  <div style={{flex: 1}}>
                    <label>Register Number</label>
                    <input type="text" name="registerNumber" value={formData.registerNumber || ''} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
              )}

              <label>Mobile Number</label>
              <input type="tel" name="mobile" value={formData.mobile || ''} onChange={handleChange} style={inputStyle} />

              <div style={{display: 'flex', gap: '10px', marginTop: '1rem'}}>
                <button className="btn btn-primary" style={{flex: 1}} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button className="btn btn-secondary" style={{flex: 1, backgroundColor: '#ccc', border: 'none', borderRadius: '20px'}} onClick={() => { setIsEditing(false); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button 
          style={{background: '#ff4d4f', color: 'white', border: 'none', padding: '0.8rem 2.5rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem'}} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
