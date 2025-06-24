import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactPaginate from "react-paginate";
import AOS from "aos";
import "aos/dist/aos.css";
import Skeleton from "@mui/material/Skeleton";
import TourCard from "../components/TourCard";

// Constants
const today = new Date().toISOString().split("T")[0];
const DURATIONS = ["1 day", "2 days", "1 week"];
const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", 
  "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa",
  "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel",
  "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane"
];

// Filter Components
const FilterSelect = ({ label, value, onChange, options = [] }) => {
  return (
    <select
      className="form-select rounded-pill shadow-sm"
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map((option, index) =>
        typeof option === "object" ? (
          <option key={option.id || index} value={option.id}>
            {option.name}
          </option>
        ) : (
          <option key={index} value={option}>
            {`${index + 1} - ${option}`}
          </option>
        )
      )}
    </select>
  );
};

const FilterInput = ({ label, value, onChange, type = "text", min }) => {
  return (
    <input
      type={type}
      min={min}
      className="form-control rounded-pill shadow-sm"
      placeholder={label}
      value={value}
      onChange={onChange}
    />
  );
};

// API functions
const fetchTours = async ({ queryKey }) => {
  const [_key, page, filters] = queryKey;
  const res = await axios.get("http://localhost:8000/api/tours", {
    params: { ...filters, page },
  });
  return res.data;
};

const fetchCategories = async () => {
  const res = await axios.get("http://localhost:8000/api/categories");
  return res.data;
};

const TourList = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    date: "",
    duration: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  // Tours query with SWR caching
  const {
    data: toursData,
    isLoading: toursLoading,
    isError: toursError,
    isFetching: isFetchingTours,
    refetch: refetchTours,
  } = useQuery({
    queryKey: ["tours", currentPage + 1, filters],
    queryFn: fetchTours,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });

  // Categories query with SWR caching
  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: isFetchingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // Categories are fresh for 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // Cache categories for 24 hours
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      date: "",
      duration: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    setCurrentPage(0);
  };

  return (
    <div className="container-fluid py-4">
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h6 className="section-title bg-white text-center text-primary px-3">
          Tours
        </h6>
        <h1 className="mb-5">Awesome Tours</h1>
      </div>

      <div className="row">
        {/* Filter Column */}
        <div className="col-lg-3">
          <div 
            className="filter-box p-4 rounded-4 mb-4 sticky-top"
            style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
              top: '20px',
              zIndex: 1000
            }}
            data-aos="fade-up"
          >
            <h5 className="mb-4 fw-bold" style={{ color: '#4a6bff' }}>
              <i className="bi bi-funnel-fill me-2"></i> Filter Options
            </h5>
            
            <div className="row g-3">
              <div className="col-12" data-aos="fade-up" data-aos-delay="50">
                <div className="position-relative">
                  <FilterInput
                    label="Search by keyword..."
                    value={filters.keyword}
                    onChange={(e) => updateFilter("keyword", e.target.value)}
                    className="ps-4"
                  />
                </div>
              </div>

              <div className="col-12" data-aos="fade-up" data-aos-delay="100">
                <FilterSelect
                  label="Location"
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                  options={wilayas}
                  icon="bi-geo-alt"
                />
              </div>

              <div className="col-12" data-aos="fade-up" data-aos-delay="200">
                <div className="position-relative">
                  <FilterInput
                    type="date"
                    label="Date"
                    value={filters.date}
                    min={today}
                    onChange={(e) => updateFilter("date", e.target.value)}
                    className="ps-4"
                  />
                </div>
              </div>

              <div className="col-12" data-aos="fade-up" data-aos-delay="300">
                <FilterSelect
                  label="Duration"
                  value={filters.duration}
                  onChange={(e) => updateFilter("duration", e.target.value)}
                  options={DURATIONS}
                  icon="bi-clock"
                />
              </div>

              <div className="col-12" data-aos="fade-up" data-aos-delay="350">
                <FilterSelect
                  label="Category"
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  options={categories || []}
                  isLoading={categoriesLoading || isFetchingCategories}
                  icon="bi-tag"
                />
              </div>

              <div className="col-12" data-aos="fade-up" data-aos-delay="400">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="position-relative">
                      <FilterInput
                        type="number"
                        label="Min Price (DA)"
                        value={filters.minPrice}
                        onChange={(e) => updateFilter("minPrice", e.target.value)}
                        className="ps-4"
                      />
                      <i className="bi bi-currency-dinar position-absolute" style={{
                        top: '38px',
                        left: '15px',
                        color: '#86b817'
                      }}></i>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="position-relative">
                      <FilterInput
                        type="number"
                        label="Max Price (DA)"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter("maxPrice", e.target.value)}
                        className="ps-4"
                      />
                      <i className="bi bi-currency-dinar position-absolute" style={{
                        top: '38px',
                        left: '15px',
                        color: '#86b817'
                      }}></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12" data-aos="fade-up" data-aos-delay="550">
                <button
                  className="btn btn-outline-primary w-100 fw-bold rounded-pill py-2 mt-2"
                  onClick={resetFilters}
                  style={{
                    borderColor: '#86b817',
                    color: '#86b817',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#86b817';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#86b817';
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Column */}
        <div className="col-lg-9">
          <div className="container py-2">
            {toursLoading && !toursData ? (
              <div className="row g-4">
                {[...Array(6)].map((_, i) => (
                  <div className="col-md-4" key={i}>
                    <Skeleton 
                      variant="rectangular" 
                      height={300} 
                      animation="wave" 
                      sx={{ borderRadius: '8px' }}
                    />
                    <Skeleton height={30} width="80%" />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </div>
                ))}
              </div>
            ) : toursError ? (
              <div className="text-center py-5">
                <h5 className="text-danger">⚠️ Error loading tours. Please try again.</h5>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => refetchTours()}
                >
                  Retry
                </button>
              </div>
            ) : toursData?.data?.length === 0 ? (
              <div className="text-center py-5">
                <h5 className="text-muted">😕 No tours found matching your criteria</h5>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 text-muted d-flex justify-content-between align-items-center">
                  <span>
                    Showing {toursData?.data?.length} of {toursData?.total || 0} tours
                  </span>
                  {isFetchingTours && (
                    <span className="text-primary">
                      <i className="fas fa-sync-alt fa-spin me-2"></i>
                      Updating...
                    </span>
                  )}
                </div>
                
                <div className="row g-4">
                  {toursData?.data?.map((tour, index) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      delay={0.2 + (index % 3) * 0.1}
                    />
                  ))}
                </div>

                {toursData?.last_page > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <ReactPaginate
                      pageCount={toursData?.last_page || 1}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={1}
                      onPageChange={handlePageClick}
                      forcePage={currentPage}
                      containerClassName="pagination"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousLabel="«"
                      nextLabel="»"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      activeClassName="active"
                      disabledClassName="disabled"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourList;