import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, set, push } from "firebase/database";
import { Link } from "react-router-dom";
import "../styles/Jobs.css";
import sendIcon from "../assets/send-icon.png";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [topCompanies, setTopCompanies] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [ratingCounts, setRatingCounts] = useState({});
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const jobsRef = ref(db, "jobs");
    const reviewsRef = ref(db, "reviews");
    const ratingsRef = ref(db, "ratings");

    // Fetch jobs data from Firebase
    onValue(jobsRef, (snapshot) => {
      if (snapshot.exists()) {
        const jobsData = snapshot.val();
        const jobsArray = Object.entries(jobsData).map(([id, job]) => ({ id, ...job }));
        setJobs(jobsArray);
      } else {
        setJobs([]);
      }
    });

    // Fetch reviews data from Firebase
    onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        const reviewsArray = Object.entries(reviewsData).map(([id, review]) => ({ id, ...review }));
        setReviews(reviewsArray);
      } else {
        setReviews([]);
      }
    });

    // Fetch ratings data from Firebase
    onValue(ratingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const ratingsData = snapshot.val();
        const ratingsMap = {};

        // Collect ratings by job id and user
        Object.entries(ratingsData).forEach(([jobId, ratings]) => {
          ratingsMap[jobId] = {};
          Object.entries(ratings).forEach(([userId, rating]) => {
            if (rating > 0) {
              ratingsMap[jobId][userId] = rating;
            }
          });
        });

        // Set ratings in state
        setSelectedRatings(ratingsMap);

        // Calculate rating counts (distinct users who rated)
        const counts = {};
        Object.entries(ratingsMap).forEach(([jobId, ratings]) => {
          counts[jobId] = Object.keys(ratings).length; // Count unique users
        });
        setRatingCounts(counts);
      }
    });
  }, []);

  // Update the top companies based on ratings
  useEffect(() => {
    const companiesWithRatings = {};

    // Aggregate ratings for each company
    jobs.forEach((job) => {
      let totalRating = 0;
      let ratingCount = 0;

      // Get the job's ratings from the selectedRatings state
      const jobRatings = selectedRatings[job.id] || {};
      Object.values(jobRatings).forEach((rating) => {
        totalRating += rating;
        ratingCount += 1;
      });

      // Only include jobs with ratings
      if (ratingCount > 0) {
        const avgRating = totalRating / ratingCount;
        if (avgRating >= 4) {
          companiesWithRatings[job.company] = companiesWithRatings[job.company] || { totalRating: 0, count: 0 };
          companiesWithRatings[job.company].totalRating += totalRating;
          companiesWithRatings[job.company].count += ratingCount;
        }
      }
    });

    // Sort companies by average rating
    const topCompaniesArray = Object.keys(companiesWithRatings)
      .map((company) => ({
        company,
        avgRating: companiesWithRatings[company].totalRating / companiesWithRatings[company].count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating);

    setTopCompanies(topCompaniesArray);
  }, [selectedRatings, jobs]);

  // Handle star click for rating
  const handleStarClick = (jobId, index) => {
    const currentRating = selectedRatings[jobId] || {};
    const userId = `user_${Math.floor(Math.random() * 10000)}`; // Mock user ID
    const newRating = currentRating[userId] === index + 1 ? 0 : index + 1; // Toggle rating: 0 means removed

    // Update the rating in Firebase
    set(ref(db, `ratings/${jobId}/${userId}`), newRating);

    // Update the selected ratings state
    setSelectedRatings((prevRatings) => ({
      ...prevRatings,
      [jobId]: { ...prevRatings[jobId], [userId]: newRating },
    }));
  };

  // Handle comment submission
  const handleSubmitComment = () => {
    if (comment.trim() !== "" && selectedCompany) {
      const newReview = {
        user: name.trim() !== "" ? name : "Anonymous",
        company: selectedCompany,
        text: comment,
      };
      push(ref(db, "reviews"), newReview);
      setComment("");
      setName("");
      setSelectedCompany("");
    }
  };

  // Filter jobs based on search and filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || job.category === filter;
    return matchesSearch && matchesFilter;
  });

  // Open job details modal
  const openModal = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  return (
    <div className="jobs-container">
      <div className="sidebar">
        <h3 className="sidebar-title">Top Companies</h3>
        <ul className="company-list">
          {topCompanies.length > 0 ? (
            topCompanies.map((company, index) => (
              <li key={index} className="company-item">
                {company.company} - {company.avgRating.toFixed(1)} stars
              </li>
            ))
          ) : (
            <p>No top companies.</p>
          )}
        </ul>
      </div>
      <div className="jobs-content">
        <h2 className="jobs-title">Available Jobs</h2>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
          <select className="filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="tech">Tech</option>
            <option value="marketing">Marketing</option>
            <option value="design">Design</option>
          </select>
        </div>
        {filteredJobs.length > 0 ? (
          <ul className="jobs-list">
            {filteredJobs.map((job) => (
              <li key={job.id} className="job-card2">
                <div className="job-header">
                   <span className="job-title">
                    <span>Job Title:</span>
                     <span className="blue-text">{job.title}</span> {/* Ensure this is wrapped */}
                     </span>
                     <span className="job-company">
                    <span>Company: </span>
                    <span className="blue-text">{job.company}</span> {/* Ensure this is wrapped */}
                    </span>
                </div>
                <p className="job-description">
                  <strong>Job Description:</strong>
                  <span className="blue-text">{job.description}</span> {/* Wrapped in .blue-text */}
                </p>
                <p className="job-location">
                  <strong>Location:</strong>
                  <span className="blue-text">{job.location}</span> {/* Wrapped in .blue-text */}
                </p>
                <p className="job-salary">
                 <strong>Salary:</strong>
                 <span className="blue-text">{job.salary ? `$${job.salary}` : "Not specified"}</span> {/* Wrapped in .blue-text */}
                 </p>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${selectedRatings[job.id] && Object.values(selectedRatings[job.id]).some(r => r > i) ? "selected" : ""}`}
                      onClick={() => handleStarClick(job.id, i)}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-count">({ratingCounts[job.id] || 0} ratings)</span>
                </div>
                <button className="details-btn" onClick={() => openModal(job)}> View Details </button>
                <Link to={`/apply/${job.id}`} className="apply-btn" state={{ jobId: job.id }}>Apply Now</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs available.</p>
        )}
        <div className="reviews-section">
          <h3 className="reviews-title">Community Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="review-card">
                <span className="review-user">{review.user}</span>
                <span className="review-company"> - {review.company}</span>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to share your experience!</p>
          )}
          <input
            type="text"
            placeholder="Your Name (or leave blank for Anonymous)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
          <select className="company-dropdown" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            <option value="">Select Company</option>
            {topCompanies.map((company, index) => (
              <option key={index} value={company.company}>{company.company}</option>
            ))}
          </select>
          <textarea
            className="comment-box"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="submit-button" onClick={handleSubmitComment}>
            <img src={sendIcon} alt="Send" style={{ width: "24px", height: "24px" }} />
          </button>
        </div>
      </div>

      {modalVisible && selectedJob && (
        <div className="job-details-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <h1><strong>Job Requirements</strong></h1>
            <h2>{selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Requirements:</strong>{selectedJob.requirements}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;