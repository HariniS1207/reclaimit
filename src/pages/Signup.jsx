import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔁 Check verification status continuously
  useEffect(() => {
    let interval;

    if (auth.currentUser) {
      interval = setInterval(async () => {
        await auth.currentUser.reload();

        if (auth.currentUser.emailVerified) {
          setVerified(true);
          setMessage("Email verified successfully ✅");
          clearInterval(interval);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, []);

  // 📧 Send verification email
  const handleSendVerification = async () => {
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Enter email and password first");
      return;
    }

    try {
      setLoading(true);

      // Create temporary user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send verification email
     await sendEmailVerification(auth.currentUser, {
  url: "https://reclaimitweb.vercel.app/signup",
  handleCodeInApp: true
});

      setMessage("Verification email sent 📩 Check your inbox");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Final account creation (Firestore)
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!auth.currentUser || !auth.currentUser.emailVerified) {
      setError("Please verify your email first");
      return;
    }

    try {
      setLoading(true);

      // Save user in Firestore
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        email: auth.currentUser.email,
        createdAt: new Date(),
      });

      setMessage("Account created successfully 🎉");

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass" style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem" }}>
      <h2>Sign Up</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleCreateAccount} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={verified}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={verified}
          required
        />

        {!verified && (
          <button type="button" onClick={handleSendVerification}>
            {loading ? "Sending..." : "Send Verification Link"}
          </button>
        )}

        <button type="submit" disabled={!verified}>
          Create Account
        </button>

      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;