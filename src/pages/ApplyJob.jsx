import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { ref, push } from "firebase/database";
import { useParams } from "react-router-dom";

const ApplyJob = () => {
  const { jobId } = useParams(); // Get job ID from URL
  const [application, setApplication] = useState({
    name: "",
    email: "",
    resume: "",
  });

  const handleChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const applicationsRef = ref(db, "applications");
      await push(applicationsRef, {
        ...application,
        jobId, // ✅ Store jobId in the application
        status: "Pending ⏳",
      });
      alert("Application submitted!");
      setApplication({ name: "", email: "", resume: "" });
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div>
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={application.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={application.email} onChange={handleChange} required />
        <textarea name="resume" placeholder="Your Resume (Paste here)" value={application.resume} onChange={handleChange} required />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default ApplyJob;
