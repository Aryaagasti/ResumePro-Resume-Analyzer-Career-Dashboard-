import React, { useState } from "react";
import { matchJobs } from "../../services/jobService";
import { 
  FaSearch, FaBriefcase, FaStar, FaExternalLinkAlt
} from "react-icons/fa";
import { ProgressBar, Badge, Alert, Spinner } from "react-bootstrap";

const JobMatchAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [query, setQuery] = useState("Software Engineer");
  const [location, setLocation] = useState("India");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOC/DOCX file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setResumeFile(file);
    setError('');
  };

  const handleMatchJobs = async () => {
    if (!resumeFile) {
      setError("Please upload a resume.");
      return;
    }

    setLoading(true);
    setError("");
    setJobs([]);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("query", query);
      formData.append("location", location);

      const result = await matchJobs(formData);
      setJobs(result.jobs || []);
    } catch (err) {
      setError(err.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        <FaBriefcase className="mr-2" /> Job Match Analyzer
      </h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <div className="form-group mb-3">
        <label htmlFor="resumeFile">Upload Resume (PDF/DOCX)</label>
        <input 
          type="file" 
          className="form-control" 
          accept=".pdf,.doc,.docx" 
          onChange={handleFileUpload} 
          required 
        />
      </div>
      
      <div className="form-group mb-3">
        <label htmlFor="query">Job Title</label>
        <input 
          type="text" 
          className="form-control" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="e.g., Software Engineer" 
          required 
        />
      </div>
      
      <div className="form-group mb-4">
        <label htmlFor="location">Location</label>
        <input 
          type="text" 
          className="form-control" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="e.g., India" 
          required 
        />
      </div>
      
      <button 
        onClick={handleMatchJobs} 
        className="btn btn-primary w-100 mb-4" 
        disabled={loading || !resumeFile}
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="me-2" /> 
            Searching...
          </>
        ) : (
          <>
            <FaSearch className="mr-2" /> Find Matching Jobs
          </>
        )}
      </button>

      {jobs.length > 0 && (
        <div>
          <h3 className="text-center mb-4">
            <FaStar className="mr-2 text-warning" /> Matching Jobs ({jobs.length})
          </h3>
          {jobs.map((job, index) => (
            <div key={index} className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {job.company} - {job.location}
                </h6>
                <Badge pill bg="info">{job.matching_score}% Match</Badge>
                <ProgressBar 
                  now={job.matching_score} 
                  label={`${job.matching_score}%`} 
                  variant="info" 
                  className="mb-3" 
                />
                <a 
                  href={job.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-success w-100 mt-2"
                >
                  <FaExternalLinkAlt className="mr-2" /> Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatchAnalyzer;