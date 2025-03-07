import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import homeImage from "../assets/homepic-removebg-preview.png"; 
import searchIcon from "../assets/search-icon.png";
import profileIcon from "../assets/profile-icon.png";
import sendIcon from "../assets/send-icon.png";
import employerIcon from "../assets/employer-icon.png";
import ADD from "../assets/add.png";
import linkedin from "../assets/linked-in.png";
import fb from"../assets/facebook.png";
import check from"../assets/check-icon.png";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Home = ({ darkMode }) => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const jobsRef = ref(db, "jobs");
    onValue(jobsRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Snapshot Data:", snapshot.val()); // Debugging line
        const jobsArray = Object.entries(snapshot.val()).map(([id, job]) => ({
          id,
          ...job,
        }));
        setJobs(jobsArray);
      } else {
        console.log("No data found in Firebase.");
        setJobs([]);
      }
    });
  }, []);

  const handleApplyClick = () => {
    toast.info("You have to sign up first.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      onClose: () => {
        Swal.fire({
          title: "Sign Up Required",
          text: "Do you want to sign up now?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, Sign Up",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/register");
          }
        });
      },
    });
  };
  
  return (
    <div className={darkMode ? "dark-mode" : ""}>
      {/* Hero Section */}
      <section id="hero-section" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Find Your Next Internship <br />
              or Part-Time Job!
            </h1>
            <p>
              Browse the latest job opportunities, create your profile, <br />
              and start applying today.
            </p>
            {/* Buttons for Sign Up and Browse Jobs */}
            <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary"> Sign Up</Link>
              <Link to="/jobs" className="btn btn-secondary">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="hero-image">
          <img src={homeImage} alt="Job Search" />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="key-features">
        <h2>Key Features</h2>
        <div className="features-container">
          <div className="Job-card">
            <img src={searchIcon} alt="Job Search" />
            <h3>Job Search Made Easy</h3>
            <p>Find internships and part-time jobs<br /> that fit your skills and interests.</p>
          </div>
          <div className="Profile-card">
            <img src={profileIcon} alt="Profile Icon" />
            <h3>Profile Creation</h3>
            <p>Create your profile in minutes and<br /> upload your resume with ease.</p>
          </div>
          <div className="Quick-card">
            <img src={sendIcon} alt="Sent Icon" />
            <h3>Quick Applications</h3>
            <p>Apply to jobs with a single click and<br /> track your application status.</p>
          </div>
          <div className="Employer-card">
            <img src={employerIcon} alt="employer Icon" />
            <h3>Employer Access</h3>
            <p>Companies can post job listings and<br /> discover top student talent.</p>
          </div>
        </div>
      </section>

     {/* How It Works Section */}
       <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
          <img src={ADD} alt="add acc" />
        <h3>Create Your Profile</h3>
          <p>Get started by creating your professional profile.</p>
          </div>
       <div className="step-card">
       <img src={searchIcon} alt="Browse" />
          <h3>Browse Jobs</h3>
          <p>Explore available opportunities in your field.</p>
      </div>
      <div className="step-card">
      <img src={check} alt="Check" />
          <h3>Apply & Track</h3>
          <p>Submit applications and monitor their status.</p>
       </div>
     </div>
  </section>
   
     {/* Featured Jobs Section */}
<section id="featured-jobs" className="featured-jobs">
  <h2>Featured Jobs</h2>
  <div className="job-cards">
    {jobs.length > 0 ? (
      jobs.slice(0, 4).map((job) => ( // Limit to the first 4 jobs
        <div key={job.id} className="job-card">
          <div className="job-card-image">
            {/* Placeholder for the job image */}
          </div>
          <h3>{job.title}</h3>
          <p className="company"><span>Company: </span>{job.company}</p>
          <p className="description"><span>Description: </span>{job.description}</p>
          <p><span>Location: </span>{job.location}</p>
          {/* Apply Button */}
          <div className="actions">
            <button className="btn-apply" onClick={handleApplyClick}>Apply Now</button>
          </div>
        </div>
      ))
    ) : (
      <p className="no-jobs">No jobs available at the moment.</p>
    )}
  </div>
</section>


{/* Ready to Get Started Section */}
<section className="get-started">
  <h2>Ready to Get Started?</h2>
  <p>Join now to explore opportunities!</p>
  <div className="btn-start">
    <Link to="/signup" className="btn-sign">Sign Up</Link>
    <Link to="/post-job" className="btn-post">Post a Job</Link>
  </div>
</section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/about">About</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
        <div className="footer-connect">
          <h3>Connect With Us</h3>
          <div className="footer-connect-icons">
          <img src={linkedin} alt="linked In Icon" />
          <img src={fb} alt="fb Icon" />
          </div>
        </div>
        <div className="footer-contact">
          <h3 >Contact</h3>
          <p>Email: info@studentjobs.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="footer-copyright">
          <p>© 2025 StudentJobs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
