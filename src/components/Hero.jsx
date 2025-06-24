import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const Hero = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim()) {
        fetchResults();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/tours", {
        params: { keyword },
        withCredentials: true,
      });
      setResults(res.data.data);
      setShowResults(true);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (tour) => {
    window.location.href = `/tours/${tour.id}`;
  };

  const handleFocus = () => {
    if (results.length > 0) setShowResults(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div
      className="hero-section"
      style={{ minHeight: "86vh", padding: "40px 0" }}
    >
      <div className="container text-center py-3">
        <h1 className="display-4 fw-bold text-white mb-4" data-aos="fade-down">
          Discover Algeria, Your Way
        </h1>

   
       {/* Search Box */}
<div
  className="search-box position-relative mx-auto"
  data-aos="fade-up"
  style={{
    maxWidth: "600px",
    background: "rgba(148, 148, 148, 0.38)", // رمادية فاتحة
    borderRadius: "50px",
    padding: "10px 20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  {/* Search Icon Button */}
  <button
    onClick={fetchResults}
    className="btn d-flex justify-content-center align-items-center"
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#86b817", // أخضر
      border: "none",
      color: "white",
      cursor: "pointer",
    }}
    aria-label="Search"
  >
    <i className="bi bi-search"></i>
  </button>

  {/* Input */}
  <input
    type="text"
    className="form-control border-0 shadow-none"
    placeholder="Search"
    style={{
      flex: 1,
      fontSize: "16px",
      backgroundColor: "white", // input أبيض
      borderRadius: "30px",
      padding: "8px 16px",
    }}
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    onFocus={handleFocus}
    onBlur={handleBlur}
  />

  {/* Results Dropdown */}
  {showResults && (
    <ul
      className="list-group position-absolute w-100 mt-2 z-3 bg-white shadow rounded-4 overflow-hidden"
      style={{
        top: "100%",
        left: 0,
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      {loading ? (
        <li className="list-group-item text-muted">Loading...</li>
      ) : results.length > 0 ? (
        results.map((tour) => (
          <li
            key={tour.id}
            className="list-group-item list-group-item-action d-flex align-items-start gap-3"
            onClick={() => handleSelect(tour)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                tour.thumbnail
                  ? `http://localhost:8000/storage/images/${tour.thumbnail}`
                  : "/default-thumb.jpg"
              }
              alt={tour.title}
              className="rounded"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
            />
            <div className="flex-grow-1">
              <div className="fw-bold">{tour.title}</div>
              <div className="text-muted small">
                {tour.description?.slice(0, 100)}...
              </div>
            </div>
          </li>
        ))
      ) : (
        keyword && (
          <li className="list-group-item text-muted">No results found</li>
        )
      )}
    </ul>
  )}
</div>

      </div>
    </div>
  );
};

export default Hero;
