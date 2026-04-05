import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Poll Firebase every 3s to check if the user clicked the link
  useEffect(() => {
    const interval = setInterval(async () => {
      await currentUser?.reload();          // refresh token from Firebase
      if (currentUser?.emailVerified) {
        clearInterval(interval);
        navigate('/dashboard');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    try {
      await sendEmailVerification(currentUser);
      setMessage('Verification email resent!');
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="glass" style={{ padding: '3rem', maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>Check your email</h2>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        We sent a verification link to <strong>{currentUser?.email}</strong>.
        Click the link to activate your account — this page will redirect automatically.
      </p>

      {message && <p role="status" style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}

      <button
        onClick={handleResend}
        disabled={cooldown > 0}
        className="btn btn-secondary"
        style={{ marginTop: '1.5rem' }}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
      </button>
    </div>
  );
};

export default VerifyEmail;