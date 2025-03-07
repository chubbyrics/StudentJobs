import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const applicationsRef = ref(db, `applications/${job.id}`);
    onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appsArray = Object.values(data);
        setApplications(appsArray);
      }
    });
  }, [job.id]);

  return (
    <div className="job-card">
      <h3>{job.title} at {job.company}</h3>
      <p>{job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <Link to={`/apply/${job.id}`}>
        <button>Apply Now</button>
      </Link>
      {applications.length > 0 && (
        <div>
          <h4>Applicants:</h4>
          <ul>
            {applications.map((app, index) => (
              <li key={index}>
                {app.name} - {app.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobCard;
