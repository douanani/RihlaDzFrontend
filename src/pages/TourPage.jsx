"use client";

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BookingModal from "../Modal/BookingModal";
import ReportModal from "../Modal/ReportModal";

const RatingStars = ({ rating, size = "md" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`d-flex align-items-center ${sizeClasses[size]}`}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-warning me-1" />
      ))}

      {hasHalfStar && (
        <FaStarHalfAlt key="half" className="text-warning me-1" />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-warning me-1" />
      ))}
    </div>
  );
};

const TourPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [tourData, setTourData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsMeta, setReviewsMeta] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { tourId } = useParams();
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchTourData = async () => {
      try {
        setLoading(true);
        const tourRes = await axios.get(
          `http://localhost:8000/api/tours/${tourId}`
        );
        setTourData(tourRes.data.data);

        if (
          tourRes.data.data.available_dates &&
          tourRes.data.data.available_dates.length > 0
        ) {
          setSelectedDate(tourRes.data.data.available_dates[0]);
        } else {
          setSelectedDate(new Date().toISOString().split("T")[0]);
        }

        await fetchReviews(1);
      } catch (err) {
        console.error("Failed to fetch tour data", err);
        setError("Failed to load tour data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (tourId) fetchTourData();
  }, [tourId]);

  const fetchReviews = async (page) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/tours/${tourId}/reviews`,
        {
          params: { page },
        }
      );
      setReviews(res.data.reviews.data);
      setReviewsMeta({
        currentPage: res.data.reviews.current_page,
        lastPage: res.data.reviews.last_page,
        total: res.data.reviews.total,
      });
      setCurrentPage(res.data.reviews.current_page);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setReviews([]);
    }
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage);
  };

  const updateParticipants = (change) => {
    setParticipants((prev) => Math.max(1, prev + change));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleBookingClick = () => {
    if (!user) {
      Swal.fire({
        title: "Sign In Required",
        text: "You need to sign in to book this tour.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sign In",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "rounded-4",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setShowModal(true);
  };

  const renderGallery = () => {
    if (!tourData) return null;

    const images =
      tourData.images && tourData.images.length > 0
        ? tourData.images.map(
            (img) => `http://localhost:8000/storage/${img.image_path}`
          )
        : tourData.thumbnail
          ? [`http://localhost:8000/storage/images/${tourData.thumbnail}`]
          : [];

    return (
      <div className="row g-3" data-aos="fade-up">
        <div className="col-md-8">
          <div className="rounded-4 overflow-hidden shadow-sm h-100">
            <img
              src={images[0] || "https://via.placeholder.com/800x500"}
              alt="Main tour image"
              onClick={() => {
                setPhotoIndex(0);
                setIsOpen(true);
              }}
              className="img-fluid w-100 cursor-pointer"
              style={{
                height: "100%",
                minHeight: "300px",
                objectFit: "cover",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="row g-3 h-100">
            {images.slice(1, 4).map((src, index) => (
              <div className="col-12" key={index + 1}>
                <div className="rounded-4 overflow-hidden shadow-sm">
                  <img
                    src={src}
                    alt={`Tour ${index + 1}`}
                    onClick={() => {
                      setPhotoIndex(index + 1);
                      setIsOpen(true);
                    }}
                    className="img-fluid w-100 cursor-pointer"
                    style={{
                      height: "140px",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
              </div>
            ))}
            {images.length > 4 && (
              <div className="col-12">
                <div
                  className="rounded-4 overflow-hidden shadow-sm position-relative cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  <img
                    src={images[4]}
                    alt="Tour gallery"
                    className="img-fluid w-100"
                    style={{
                      height: "140px",
                      objectFit: "cover",
                      filter: "brightness(0.7)",
                    }}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
                    <h5 className="mb-0">+{images.length - 4} more</h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHighlights = () => {
    if (!tourData?.highlights || tourData.highlights.length === 0) return null;

    return (
      <div className="row row-cols-1 row-cols-md-2 g-3">
        {tourData.highlights.map((highlight, index) => (
          <div key={index} className="col">
            <div className="d-flex align-items-start p-3 rounded-3 bg-light border">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white flex-shrink-0"
                style={{ width: "32px", height: "32px" }}
              >
                <FaCheck size={14} />
              </div>
              <span className="ms-3">{highlight}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReviews = () => {
    if (reviews.length === 0) {
      return (
        <div className="text-center py-5">
          <div className="mb-3">
            <FaStar className="text-muted" size={48} />
          </div>
          <h5>No reviews yet</h5>
          <p className="text-muted">Be the first to review this tour</p>
        </div>
      );
    }

    return (
      <div className="row g-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="col-md-6"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="border rounded-4 p-4 h-100 shadow-sm bg-white review-card">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={
                    `http://localhost:8000/storage/${review.user?.profile_photo_path}` ||
                    "https://via.placeholder.com/55"
                  }
                  alt={review.user?.name || "Anonymous"}
                  className="rounded-circle me-3 border"
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h6 className="mb-0 fw-bold">
                    {review.user?.name || "Anonymous"}
                  </h6>
                  <small className="text-muted">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                      day: "numeric",
                    })}
                  </small>
                </div>
              </div>
              <div className="mb-3">
                <RatingStars rating={review.rating} />
              </div>
              <p className="mb-0" style={{ fontSize: "15px" }}>
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (reviewsMeta.lastPage <= 1) return null;

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link rounded-start-pill"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {[...Array(reviewsMeta.lastPage)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === reviewsMeta.lastPage ? "disabled" : ""}`}
          >
            <button
              className="page-link rounded-end-pill"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === reviewsMeta.lastPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger rounded-4 shadow-sm">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="mb-1">Error loading tour</h5>
              <p className="mb-0">{error}</p>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 shadow-sm">
          <h5 className="mb-1">Tour not found</h5>
          <p className="mb-0">
            The tour you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  // Prepare slides for the lightbox
  const slides =
    tourData.images && tourData.images.length > 0
      ? tourData.images.map((img) => ({
          src: `http://localhost:8000/storage/${img.image_path}`,
          alt: tourData.name,
        }))
      : tourData.thumbnail
        ? [
            {
              src: `http://localhost:8000/storage/images/${tourData.thumbnail}`,
              alt: tourData.name,
            },
          ]
        : [];

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <div className="bg-light rounded-4 p-4 mb-4 shadow-sm">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/tours">Tours</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {tourData.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Tour Header Section */}
      <header className="mb-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-primary rounded-pill me-2">
                {tourData.category?.name || "Uncategorized"}
              </span>
              <RatingStars rating={Math.floor(averageRating)} size="sm" />
              <small className="text-muted ms-2">
                ({reviewsMeta.total || 0} review
                {reviewsMeta.total !== 1 ? "s" : ""})
              </small>
            </div>

            <h1 className="display-5 fw-bold mb-3">{tourData.title}</h1>

            <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
              <div className="d-flex align-items-center">
                <FaMapMarkerAlt className="text-muted me-2" />
                <span>{tourData.location || "Location not specified"}</span>
              </div>
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="text-muted me-2" />
                <span>
                  {formatDate(tourData.start_date)} -{" "}
                  {formatDate(tourData.end_date)}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <FaClock className="text-muted me-2" />
                <span>{tourData.duration} days</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="mb-5">
        {renderGallery()}
        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={slides}
            index={photoIndex}
          />
        )}
      </section>

      {/* Main Content */}
      <div className="row gx-5">
        <div className="col-lg-8">
          {/* Description Section */}
          <section className="mb-5">
            <h2 className="h4 fw-bold mb-3">About this tour</h2>
            <div className="bg-light p-4 rounded-4">
              <p className="mb-0">{tourData.description}</p>
            </div>
          </section>

          {/* Highlights Section */}
          {tourData.highlights && tourData.highlights.length > 0 && (
            <section className="mb-5">
              <h2 className="h4 fw-bold mb-3">Tour Highlights</h2>
              {renderHighlights()}
            </section>
          )}

          {/* Reviews Section */}
          <section className="mb-5">
            <h2 className="h4 fw-bold mb-3">Traveler Reviews</h2>

            <div className="bg-primary text-white p-4 rounded-4 shadow-sm mb-4">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <span className="display-4 fw-bold">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="fs-5">/5</span>
                    </div>
                    <div>
                      <RatingStars
                        rating={Math.round(averageRating)}
                        size="lg"
                      />
                      <small className="d-block mt-1">
                        Based on {reviewsMeta.total || 0} review
                        {reviewsMeta.total !== 1 ? "s" : ""}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(
                      (r) => Math.round(r.rating) === star
                    ).length;
                    const percentage =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                    return (
                      <div
                        key={star}
                        className="d-flex align-items-center mb-2"
                      >
                        <small
                          className="text-nowrap me-2"
                          style={{ width: "30px" }}
                        >
                          {star} <FaStar className="text-warning" />
                        </small>
                        <div
                          className="progress flex-grow-1"
                          style={{ height: "8px" }}
                        >
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <small
                          className="text-nowrap ms-2"
                          style={{ width: "30px" }}
                        >
                          {count}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {renderReviews()}

            <div className="d-flex justify-content-center mt-4">
              {renderPagination()}
            </div>
          </section>
        </div>

        {/* Booking Sidebar */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "20px" }}>
            <section className="mb-4 bg-white rounded-4 shadow-sm border p-4">
              <h2 className="h5 fw-bold mb-3">Book This Tour</h2>

              {!user ? (
                <div className="text-center py-4">
                  <div className="bg-light rounded-4 p-4 mb-3">
                    <FaLock size={32} className="text-primary mb-3" />
                    <h5 className="fw-bold mb-2">Sign In to Book</h5>
                    <p className="text-muted mb-3">
                      You need to sign in to book this tour and access all
                      features.
                    </p>
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={() => navigate("/login")}
                    >
                      Sign In Now
                    </button>
                  </div>
                </div>
              ) : (
                <form>
                  {tourData.available_dates &&
                    tourData.available_dates.length > 0 && (
                      <div className="mb-3">
                        <label
                          htmlFor="tour-date"
                          className="form-label fw-bold"
                        >
                          Select Date
                        </label>
                        <select
                          id="tour-date"
                          className="form-select rounded-pill"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        >
                          {tourData.available_dates.map((date, index) => (
                            <option key={index} value={date}>
                              {formatDate(date)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  <div className="mb-4">
                    <label
                      htmlFor="participants-count"
                      className="form-label fw-bold"
                    >
                      Participants
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateParticipants(-1)}
                        className="btn btn-outline-secondary rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      >
                        -
                      </button>
                      <span
                        id="participants-count"
                        className="fs-4 fw-bold flex-grow-1 text-center"
                      >
                        {participants}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateParticipants(1)}
                        className="btn btn-outline-secondary rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        ${tourData.price} x {participants}
                      </span>
                      <span>${tourData.price * participants}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ${participants * tourData.price}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-100 btn btn-primary rounded-pill py-3 fw-bold"
                    onClick={handleBookingClick}
                  >
                    Book Now
                  </button>
                </form>
              )}
            </section>

            {/* Updated Report Section */}
            <section
              className="bg-white rounded-4 shadow-sm border p-4 mt-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger bg-opacity-10 p-2 rounded-3 me-3">
                  <FaExclamationTriangle className="text-danger" size={20} />
                </div>
                <h3 className="h5 fw-bold mb-0">Report an Issue</h3>
              </div>
              <p className="small text-muted mb-3">
                Found incorrect information or suspicious activity? Let us know
                to help improve our platform.
              </p>
              <button
                className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowReportModal(true)}
              >
                <FaExclamationTriangle /> Report This Tour
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <BookingModal
          onClose={() => setShowModal(false)}
          participants={participants}
          totalPrice={participants * tourData.price}
          selectedDate={selectedDate}
          tourName={tourData.name}
          tourId={tourId}
          user={user}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          tourId={tourId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default TourPage;