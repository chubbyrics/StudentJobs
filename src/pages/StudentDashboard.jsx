import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import "../styles/Student.css";

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const auth = getAuth();
  const studentEmail = auth.currentUser?.email; // Get the logged-in user's email

  useEffect(() => {
    if (!studentEmail) return; // Exit if the user is not logged in

    // Fetch all applications
    const applicationsRef = ref(db, "applications");
    onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentApplications = Object.entries(data)
          .map(([id, app]) => ({ id, ...app }))
          .filter((app) => app.email === studentEmail); // Filter by the logged-in user's email

        console.log("Student Applications:", studentApplications);

        // Now that we have the applications, we need to get the job details for each application
        const jobIds = studentApplications.map((app) => app.jobId);
        if (jobIds.length > 0) {
          const jobsRef = ref(db, "jobs");
          onValue(jobsRef, (snapshot) => {
            const jobData = snapshot.val();
            if (jobData) {
              const jobDetails = Object.entries(jobData)
                .map(([id, job]) => ({ id, ...job }))
                .filter((job) => jobIds.includes(job.id)); // Only include jobs that are applied to

              console.log("Job Details:", jobDetails);

              // Add job details to the applications (only company name and status)
              const applicationsWithJobDetails = studentApplications.map((app) => {
                const job = jobDetails.find((job) => job.id === app.jobId);
                console.log("Matching job for application:", job);
                return {
                  ...app,
                  company: job ? job.company : "Not Available", // Only include company name
                  status: app.status, // Keep the status
                };
              });

              setApplications(applicationsWithJobDetails);
            }
          });
        }
      }
    });
  }, [studentEmail]);

  return (
    <div>
      <h2 className="page-title">Your Job Applications</h2>

      <div className="dashboard-container">
        <div className="applications-list">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-info">
                  <h3>
                    <span style={{ color: "#1d89fd" }}>Company:</span> {app.company}
                  </h3>
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
                </div>
              </div>
            ))
          ) : (
            <p>You haven't applied to any jobs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
