import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebaseConfig";
import { ref, get } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import ApplyForm from "./components/ApplyForm";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserRole(snapshot.val().role);
          toast.success(`Welcome back, ${snapshot.val().name || "User"}!`);
        }
      } else {
        setUserRole(null);
      }
    });
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("dark-mode", newMode);
      toast.info(newMode ? "Dark mode enabled" : "Light mode enabled");
      return newMode;
    });
  };

  // Logout Function with SweetAlert2
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        const auth = getAuth();
        auth.signOut().then(() => {
          toast.success("Logged out successfully!");
          setUserRole(null);
        });
      }
    });
  };

  return (
    <Router>
      <Navbar userRole={userRole} darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        {userRole === "employer" && <Route path="/post-job" element={<PostJob />} />}
        <Route path="/dashboard" element={userRole === "employer" ? <EmployerDashboard /> : <StudentDashboard />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply/:jobId" element={<ApplyForm />} />
      </Routes>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Router>
  );
}

export default App;
