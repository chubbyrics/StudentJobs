import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import emailjs from "emailjs-com";
import "../styles/Employer.css";

const EmployerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({ date: "", message: "" });
  const auth = getAuth();
  const employerId = auth.currentUser?.uid;

  useEffect(() => {
    if (!employerId) return;

    const jobsRef = ref(db, "jobs");
    onValue(jobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employerJobs = Object.entries(data)
          .map(([id, job]) => ({ id, ...job }))
          .filter((job) => job.employerId === employerId);

        setJobPosts(employerJobs);
      }
    });
  }, [employerId]);

  useEffect(() => {
    if (jobPosts.length === 0) return;

    const applicationsRef = ref(db, "applications");
    onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jobMap = jobPosts.reduce((acc, job) => {
          acc[job.id] = job.title;
          return acc;
        }, {});

        const filteredApplications = Object.entries(data)
          .map(([id, app]) => ({
            id,
            ...app,
            jobTitle: jobMap[app.jobId] || "Unknown Position",
          }))
          .filter((app) => jobMap[app.jobId]);

        setApplications(filteredApplications);
      }
    });
  }, [jobPosts]);

  const generateMeetLink = () => {
    // Generate a random string of length 8
    const randomString = Math.random().toString(36).substring(2, 10); // This generates a string between 2 and 10 characters
    return `https://meet.google.com/${randomString}`;
  };
  

  const handleAcceptClick = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  
    const meetLink = generateMeetLink();
    setInterviewDetails({
      date: "",
      message: `Here is your interview link: ${meetLink}`,
    });
  };
  

  const handleStatusUpdate = (appId, newStatus) => {
    const applicationRef = ref(db, `applications/${appId}`);
    update(applicationRef, { status: newStatus })
      .then(() => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status: newStatus } : app
          )
        );
      })
      .catch((error) => console.error("Error updating application:", error));
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
  
    if (!selectedApp || !selectedApp.email) {
      console.error("No recipient email found.");
      return;
    }
  
    const emailParams = {
      to_email: selectedApp.email, 
      from_name: selectedApp.name, 
      company: selectedApp.company, 
      date: interviewDetails.date, 
      message: `Dear ${selectedApp.name},\n\nYou have been invited for an interview for the position of ${selectedApp.jobTitle} at ${selectedApp.company}.\n\nDate & Time: ${interviewDetails.date}\n\n${interviewDetails.message}\n\nBest regards,\n${selectedApp.jobTitle}`,
    };
  
    emailjs
      .send(
        "service_1kbnub9", 
        "template_2ejejwl", 
        emailParams,
        "S4SyvUdha2fv1eq1T" 
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response.status, response.text);
          handleStatusUpdate(selectedApp.id, "Accepted");
          setShowModal(false);
          setInterviewDetails({ date: "", message: "" });
        },
        (error) => {
          console.error("Failed to send email:", error);
        }
      );
  };
  
  

  return (
    <div>
      <h2 className="page-title">Job Applications</h2>

      <div className="dashboard-container">
        {applications.length > 0 && (
          <h3 className="job-title">{applications[0].jobTitle}</h3>
        )}

        <div className="applications-list">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-info">
                  <h3>
                    <span style={{ color: "#1d89fd" }}>Name:</span> {app.name}
                  </h3>
                  <p>
                    <span style={{ color: "#1d89fd" }}>Email:</span> {app.email}
                  </p>
                  <p>
                    <span style={{ color: "#1d89fd" }}>Status:</span>
                    <strong
                      style={{
                        color:
                          app.status === "Accepted"
                            ? "green"
                            : app.status === "Rejected"
                            ? "red"
                            : "black",
                      }}
                    >
                      {app.status}
                    </strong>
                  </p>
                  <a href={app.resume} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </div>
                <div className="button-group">
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptClick(app)}
                    disabled={app.status === "Accepted"}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusUpdate(app.id, "Rejected")}
                    disabled={app.status === "Rejected"}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No applications yet.</p>
          )}
        </div>
      </div>
      <div className="interview-section">
  <h3>Upcoming Interviews</h3>
  {applications.length > 0 ? (
    applications
      .filter((app) => app.status === "Accepted")
      .map((app) => (
        <div key={app.id} className="interview-card">
          <h4>{app.name}</h4>
          <p>{app.jobTitle}</p>
          <p>{app.interviewDate}</p>
          <p>{app.interviewMessage}</p>
        </div>
      ))
  ) : (
    <p>No upcoming interviews.</p>
  )}
</div>

      {showModal && (
  <div className="modal-container">
    <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
    <div className="modal-content">
      <button className="modal-close-btn" onClick={() => setShowModal(false)}>X</button>
      <h2 className="modal-title">Interview Invitation</h2>
      <form className="modal-form">
        <label>Date & Time:</label>
        <input
          type="datetime-local"
          value={interviewDetails.date}
          onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
        />
        <label>Additional Details:</label>
        <textarea
          value={interviewDetails.message}
          onChange={(e) => setInterviewDetails({ ...interviewDetails, message: e.target.value })}
        />
        <button className="modal-submit-btn" onClick={handleSubmit}>Send Invitation</button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default EmployerDashboard;
