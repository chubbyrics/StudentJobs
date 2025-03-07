import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css"; // Ensure you have your CSS imported

const Profile = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`profile-sidebar ${isActive ? "active" : ""}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </div>
      <div className="sidebar-content">
        <div className="user-profile">
          <div className="profile-image">
            <img src="/path-to-profile-image.jpg" alt="Profile" />
            <span className="status-indicator online"></span>
          </div>
          <h2 className="user-name">John Doe</h2>
          <p className="user-title">Software Developer</p>
          <div className="profile-completion">
            <div className="completion-bar">
              <div className="completion-progress" style={{ width: "70%" }}></div>
            </div>
            <p className="completion-text">Profile 70% complete</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          <Link to="/settings" className="nav-item">
            <i className="fas fa-cog"></i> Settings
          </Link>
          <Link to="/notifications" className="nav-item">
            <i className="fas fa-bell"></i> Notifications
            <span className="badge">3</span>
          </Link>
          <Link to="/messages" className="nav-item">
            <i className="fas fa-envelope"></i> Messages
          </Link>
          <Link to="/friends" className="nav-item">
            <i className="fas fa-users"></i> Friends
          </Link>
          <Link to="/photos" className="nav-item">
            <i className="fas fa-image"></i> Photos
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/logout" className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;