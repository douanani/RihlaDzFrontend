"use client";

import React, { useState } from "react";
import { FaExclamationTriangle, FaCheck } from "react-icons/fa";
import api from "../api/axios";

const ReportModal = ({ tourId, agencyId, onClose }) => {
  const [formData, setFormData] = useState({
    target_type: tourId ? "tour" : agencyId ? "agency" : "other",
    reason: "",
    description: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        tour_id: tourId,
        agency_id: agencyId,
      };

      await api.post("/api/reports", payload);

      setSuccess("Your report has been submitted successfully. We'll review it shortly.");
      setFormData({ ...formData, reason: "", description: "" });
      
      // Auto-close after 3 seconds if successful
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <FaExclamationTriangle className="me-2" />
              Report This Tour
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Reason</label>
                <select
                  className="form-select rounded-pill"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Incorrect Information">Incorrect Information</option>
                  <option value="Suspicious Activity">Suspicious Activity</option>
                  <option value="Pricing Issue">Pricing Issue</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Description *</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about the issue..."
                  style={{ borderRadius: '12px' }}
                  minLength="20"
                />
                <small className="text-muted">Minimum 20 characters</small>
              </div>

              {success && (
                <div className="alert alert-success rounded-4">
                  <FaCheck className="me-2" />
                  {success}
                </div>
              )}
              {error && (
                <div className="alert alert-danger rounded-4">
                  <FaExclamationTriangle className="me-2" />
                  {error}
                </div>
              )}

              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-danger rounded-pill py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle className="me-2" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;