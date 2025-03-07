import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig"; 
import { ref, push } from "firebase/database";
import "../styles/Applyform.css";

const ApplyForm = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.resume) {
      alert("Please upload a resume.");
      return;
    }
  
    const formDataUpload = new FormData();
    formDataUpload.append("file", formData.resume);
    formDataUpload.append("upload_preset", "resume_uploads"); 
    try {
      // ✅ Correct Cloudinary API URL
      const uploadResponse = await fetch(
       "https://api.cloudinary.com/v1_1/dvneiargo/upload",
        {
          method: "POST",
          body: formDataUpload,
        }
      );
  
      const uploadData = await uploadResponse.json();
  
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error?.message || "Failed to upload resume.");
      }
  
      // Save the uploaded resume URL
      const applicationData = {
        name: formData.fullName,
        email: formData.email,
        resume: uploadData.secure_url, 
        jobId: jobId,
        status: "Pending ⏳",
      };
  
      await push(ref(db, "applications"), applicationData);
  
      alert("Application submitted successfully!");
      setFormData({ fullName: "", email: "", resume: null });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };
  
  

  return (
    <div className="apply-form-wrapper">
      <div className="apply-form-container">
        <h2 className="apply-form-header">Apply for Job</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Resume:
            <input type="file" onChange={handleFileChange} required />
          </label>
          <br />
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
