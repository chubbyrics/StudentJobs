import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { db } from "../firebaseConfig";
import { ref, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "../styles/Register.css";
import mascotImage from "../assets/SJ_mascot.png";

const Register = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("select");
  const [loading, setLoading] = useState(false);
  const [eyePosition, setEyePosition] = useState({ leftX: 0, leftY: 0, rightX: 0, rightY: 0 });

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const offsetX = (clientX - window.innerWidth / 2) / 50;
      const offsetY = (clientY - window.innerHeight / 2) / 50;
      setEyePosition({ leftX: offsetX, leftY: offsetY, rightX: offsetX, rightY: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (role === "select") {
      alert("Please select either Student or Employer.");
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert("Email already in use. Please use a different email.");
        setLoading(false);
        return;
      }

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in database
      await set(ref(db, `users/${user.uid}`), {
        userID: user.uid,
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
      });

      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className={`register-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="mascot-text">
        <h3>Welcome to Student Jobs!<br/>I'm SJ, here to help you.</h3>
      </div>
      <div className="mascot-container">
        <img src={mascotImage} alt="Mascot" className="mascot-image" />
        <div className="eye left-eye" style={{ transform: `translate(${eyePosition.leftX}px, ${eyePosition.leftY}px)` }} />
        <div className="eye right-eye" style={{ transform: `translate(${eyePosition.rightX}px, ${eyePosition.rightY}px)` }} />
      </div>

      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">Sign Up</h2>
          <form onSubmit={handleRegister} className="register-form">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="register-input" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="register-input" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="register-input" />

            <select value={role} onChange={(e) => setRole(e.target.value)} className="register-input">
              <option value="select">-SELECT-</option>
              <option value="student">Student</option>
              <option value="employer">Employer</option>
            </select>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>

            <p className="login-text">Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;