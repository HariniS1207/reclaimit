import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('Student');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use': return 'This email is already registered. Please log in instead.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential': return 'Invalid email or password. Please try again.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      case 'auth/network-request-failed': return 'Network error. Please check your connection.';
      default: return error.message.replace('Firebase: ', '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, {
          firstName,
          lastName,
          designation,
          department,
          year: designation === 'Student' ? year : null,
          registerNumber: designation === 'Student' ? registerNumber : null,
          mobile
        });
        alert('Account created successfully! Please check your email for a verification link.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-overlay">
        <div className="landing-header">
          <span className="landing-logo-icon">🎓</span> 
          <h1 className="landing-title">MEENAKSHI SUNDARARAJAN ENGINEERING COLLEGE</h1>
          <p className="landing-subtitle">Welcome to the College Lost & Found System</p>
        </div>

        <div className="auth-box">
          <div className="auth-toggle">
            <button 
              className={`toggle-btn ${isLogin ? 'active' : ''}`} 
              onClick={() => { setIsLogin(true); setError(''); }}
              type="button"
            >
              Log In
            </button>
            <button 
              className={`toggle-btn ${!isLogin ? 'active' : ''}`} 
              onClick={() => { setIsLogin(false); setError(''); }}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="auth-error">{error}</p>}
            
            {!isLogin && (
              <>
                <div className="form-row">
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>

                <select value={designation} onChange={(e) => setDesignation(e.target.value)} required>
                  <option value="Student">Student</option>
                  <option value="Teaching Staff">Teaching Staff</option>
                  <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                </select>

                <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
                  <option value="" disabled>Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="Civil">Civil</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="AIDS">AIDS</option>
                  <option value="IT">IT</option>
                </select>

                {designation === 'Student' && (
                  <div className="form-row">
                    <select value={year} onChange={(e) => setYear(e.target.value)} required>
                      <option value="" disabled>Select Year</option>
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </select>
                    <input type="text" placeholder="Register Number" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} required />
                  </div>
                )}

                <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </>
            )}

            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                className="eye-icon" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
