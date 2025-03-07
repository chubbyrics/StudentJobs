import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { ref, push, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import "../styles/PostJob.css";

const PostJob = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    requirements: "",
    salary: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const formatText = (text) => {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const auth = getAuth();
    const employerId = auth.currentUser?.uid; // Get the employer's Firebase UID
  
    if (!employerId) {
      alert("Error: Employer not logged in.");
      return;
    }
  
    try {
      const jobsRef = ref(db, "jobs");
      const newJobRef = push(jobsRef);
      const jobId = newJobRef.key;
  
      const formattedJob = {
        id: jobId,
        title: formatText(job.title),
        company: formatText(job.company),
        description: job.description.trim(),
        location: formatText(job.location),
        requirements: job.requirements.trim(),
        salary: job.salary ? parseFloat(job.salary) : "Negotiable",
        employerId: employerId, // ✅ Store the actual employer UID
      };
  
      await set(newJobRef, formattedJob);
  
      alert("Job posted successfully!");
      setJob({ title: "", company: "", description: "", location: "", requirements: "", salary: "" });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Post a Job</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Left Column - Job Details */}
          <div className="left-column">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={job.title}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={job.company}
              onChange={handleChange}
              required
              className="input"
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={job.description}
              onChange={handleChange}
              required
              className="textarea"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={job.location}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Middle Gap */}
          <div className="middle-gap"></div>

          {/* Right Column - Requirements & Salary */}
          <div className="right-column">
            <div className="requirements">
              <h3>Job Requirements</h3>
              <textarea
                name="requirements"
                placeholder="Job Requirements"
                value={job.requirements}
                onChange={handleChange}
                required
                className="textarea"
              />
            </div>
            <div className="salary">
              <h3>Salary</h3>
              <input
                type="number"
                name="salary"
                placeholder="Salary (Optional)"
                value={job.salary}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Submit Button Below Both Columns */}
          <button type="submit" className="button">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
