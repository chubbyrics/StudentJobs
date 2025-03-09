import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebaseConfig";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import mascotImage from "../assets/SJ_mascot.png";

const Login = ({ setUserRole, darkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        localStorage.setItem("userRole", userData.role);
        if (rememberMe) localStorage.setItem("rememberMe", email);
        setUserRole(userData.role);
        alert("Login successful!");
        navigate("/"); // Redirect to home page with navigation links
      } else {
        alert("User data not found!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`login-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Mascot */}
      <div className="mascot-text">
        <h3>Hi!, Welcome To Student Jobs<br/>My Name is SJ</h3>
      </div>
      <div className="mascot-container">
        <img src={mascotImage} alt="Mascot" className="mascot-image" />
        <div className="eye left-eye" style={{ transform: `translate(${eyePosition.leftX}px, ${eyePosition.leftY}px)` }} />
        <div className="eye right-eye" style={{ transform: `translate(${eyePosition.rightX}px, ${eyePosition.rightY}px)` }} />
      </div>

      {/* Login Form */}
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="login-input" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="login-input" />

            {/* Remember Me & Forgot Password */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="checkbox" />
                Remember Me
              </label>
              <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button">Login</button>

            {/* Register Link */}
            <p className="register-text">
            Don't have an account? <Link to="/register" className="register-link">Register here</Link>
             </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
