import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDngHQXWSzkiRqdZiayE5-GoQvNTYu4Cx4",
  authDomain: "reclaimit-9ff5f.firebaseapp.com",
  projectId: "reclaimit-9ff5f",
  storageBucket: "reclaimit-9ff5f.firebasestorage.app",
  messagingSenderId: "665130492858",
  appId: "1:665130492858:web:0c10962f0ef46a54f0b383",
  measurementId: "G-Q9H9JH5W5Y"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
