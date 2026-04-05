import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";

const actionCodeSettings = {
  url: `${window.location.origin}`,
  handleCodeInApp: false,
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const startSignup = async (email, password, userData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email: user.email,
      createdAt: new Date().toISOString(),
    });

    await sendEmailVerification(user, actionCodeSettings);
    return userCredential;
  };

  const signup = startSignup;

  const completeSignup = async (userData) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No active user found. Please sign in again and verify your email.');
    }
    if (!currentUser.emailVerified) {
      throw new Error('Please verify your email before creating an account.');
    }

    await setDoc(doc(db, "users", currentUser.uid), {
      ...userData,
      email: currentUser.email,
      createdAt: new Date().toISOString()
    });

    return currentUser;
  };

  const sendVerificationEmail = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No active user found for verification.');
    if (currentUser.emailVerified) throw new Error('Email is already verified.');
    await sendEmailVerification(currentUser, actionCodeSettings);
    return currentUser;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email first.');
    }
    return userCredential;
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, startSignup, completeSignup, sendVerificationEmail, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
