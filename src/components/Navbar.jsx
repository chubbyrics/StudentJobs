import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // Import external CSS

const Navbar = ({ userRole, darkMode, toggleDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
    setMenuOpen(false);
  };

  const handleJobsClick = (e) => {
    e.preventDefault();
    if (userRole) {
      navigate("/jobs"); // Logged-in users go to Jobs page
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById("featured-jobs")?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        document.getElementById("featured-jobs")?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.querySelector(".footer")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      document.querySelector(".footer")?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        {/* Logo Text */}
        <div className="logo">StudentJobs</div>

        {/* Hamburger Menu Icon */}
        <div className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </div>

        {/* Navigation List */}
        <ul className={`nav-list ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" className="nav-link" onClick={handleHomeClick}>Home</Link></li>
          <li><Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/" className="nav-link" onClick={handleContactClick}>Contact</Link></li>

          {/* Show employer links only when logged in as an employer */}
          {userRole === "employer" && (
            <>
              <li><Link to="/post-job" className="nav-link" onClick={() => setMenuOpen(false)}>Post Job</Link></li>
              <li><Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Employer Dashboard</Link></li>
            </>
          )}

          {/* Show student links only when logged in as a student */}
          {userRole === "student" && (
            <>
              <li><Link to="/jobs" className="nav-link" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
              <li><Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Student Dashboard</Link></li>
            </>
          )}

          {/* Show profile only when userRole is valid */}
          {userRole && (
            <li><Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>Profile</Link></li>
          )}

          {/* Show Login only when NOT logged in */}
          {!userRole && (
            <>
              <li><Link to="/jobs" className="nav-link" onClick={handleJobsClick}>Jobs</Link></li>
              <li><Link to="/login" className="nav-link" onClick={handleLoginClick}>Login</Link></li>
            </>
          )}
        </ul>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="toggle-button">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
