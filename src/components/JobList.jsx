import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const jobsRef = ref(db, "jobs");
    onValue(jobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setJobs(Object.entries(data).map(([id, job]) => ({ id, ...job })));
      }
    });
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{job.title} at {job.company}</h3>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <Link to={`/apply/${job.id}`}>
            <button style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "blue", color: "white" }}>
              Apply Now
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default JobList;
