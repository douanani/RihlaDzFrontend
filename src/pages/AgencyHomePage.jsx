import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";

const AgencyHome = () => {
  const [stats] = useState([
    { value: "500+", label: "Partner Agencies" },
    { value: "95%", label: "Booking Satisfaction" },
    { value: "3x", label: "Average Growth" }
  ]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{
          minHeight: "86vh",
          padding: "40px 0",
          background: "linear-gradient(rgba(0, 0, 0, 0.41), rgba(0, 0, 0, 0.46)), url('/assets/img/algeria-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="container text-center py-3">
          <h1 className="display-4 fw-bold text-white mb-4" data-aos="fade-down">
            Empower Your Travel Business
          </h1>
          <p className="lead text-white mb-5" data-aos="fade-down" data-aos-delay="200">
            Grow your agency or club with our powerful platform
          </p>

          {/* CTA Buttons */}
          <div className="d-flex justify-content-center gap-3 mb-5" data-aos="fade-up" data-aos-delay="400">
            <Link to="/agency-dashboard" className="btn btn-primary btn-lg rounded-pill px-4 py-2">
              Check your Dashboard
            </Link>
            <Link to="/Tours" className="btn btn-outline-light btn-lg rounded-pill px-4 py-2">
              See other Tours
            </Link>
          </div>

     
        </div>
      </div>
      
{/* Agency Features Start */}
<div className="container-xxl py-5">
  <div className="container">
    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
      <h6 className="section-title bg-white text-center text-primary px-3">
        Tools
      </h6>
      <h1 className="mb-5">Everything Agencies Need to Succeed</h1>
    </div>
    <div className="row g-4">
      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
        <div className="service-item rounded pt-3">
          <div className="p-4">
            <i className="fa fa-3x fa-bullhorn text-primary mb-4" />
            <h5>Promote Your Tours</h5>
            <p>
              Publish your tour programs and reach a wide audience of travelers interested in adventure and exploration.
            </p>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
        <div className="service-item rounded pt-3">
          <div className="p-4">
            <i className="fa fa-3x fa-calendar-check text-primary mb-4" />
            <h5>Manage Bookings</h5>
            <p>
              View incoming reservations, approve or reject booking requests, and keep track of your tour schedules.
            </p>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
        <div className="service-item rounded pt-3">
          <div className="p-4">
            <i className="fa fa-3x fa-map-marked-alt text-primary mb-4" />
            <h5>Custom Tour Programs</h5>
            <p>
              Create detailed tour itineraries, add highlights, and specify categories and pricing options.
            </p>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
        <div className="service-item rounded pt-3">
          <div className="p-4">
            <i className="fa fa-3x fa-check-circle text-primary mb-4" />
            <h5>Verified Listings</h5>
            <p>
              Gain traveler trust with verified agency status approved by the platform’s admin team.
            </p>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
        <div className="service-item rounded pt-3">
          <div className="p-4">
            <i className="fa fa-3x fa-star text-primary mb-4" />
            <h5>Collect Reviews</h5>
            <p>
              Receive reviews from travelers who joined your tours and showcase your agency’s quality.
            </p>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
        <div className="service-item rounded pt-3">
          <div className="p-4">
            <i className="fa fa-3x fa-chart-bar text-primary mb-4" />
            <h5>Performance Overview</h5>
            <p>
              Access insights on your published tours, booking trends, and tourist engagement in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Agency Services End */}
      
      {/* Agency Benefits Start */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-light text-center text-primary px-3">
              Why Choose Us
            </h6>
            <h1 className="mb-5">Benefits for Travel Agencies</h1>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3 wow fadeInUp" data-wow-delay="0.1s">
              <div className="benefit-item text-center p-4">
                <div className="icon-box mb-3">
                  <i className="fa fa-3x fa-bolt text-primary"></i>
                </div>
                <h5>Quick Setup</h5>
                <p>Get your programs listed and bookable in minutes</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeInUp" data-wow-delay="0.3s">
              <div className="benefit-item text-center p-4">
                <div className="icon-box mb-3">
                  <i className="fa fa-3x fa-percent text-primary"></i>
                </div>
                <h5>Competitive Fees</h5>
                <p>Low commission rates that help your business grow</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeInUp" data-wow-delay="0.5s">
              <div className="benefit-item text-center p-4">
                <div className="icon-box mb-3">
                  <i className="fa fa-3x fa-shield-alt text-primary"></i>
                </div>
                <h5>Trust & Credibility</h5>
                <p>Verified agency status builds traveler confidence</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeInUp" data-wow-delay="0.7s">
              <div className="benefit-item text-center p-4">
                <div className="icon-box mb-3">
                  <i className="fa fa-3x fa-headset text-primary"></i>
                </div>
                <h5>Dedicated Support</h5>
                <p>Our team is here to help you succeed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Agency Benefits End */}
      
      {/* How It Works for Agencies Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Getting Started
            </h6>
            <h1 className="mb-5">3 Simple Steps to Grow Your Business</h1>
          </div>
          <div className="row gy-5 gx-4 justify-content-center">
            <div className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.1s">
              <div className="position-relative border border-primary pt-5 pb-4 px-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: 100, height: 100 }}>
                  <i className="fa fa-user-plus fa-3x text-white" />
                </div>
                <h5 className="mt-4">Register Your Agency</h5>
                <hr className="w-25 mx-auto bg-primary mb-1" />
                <hr className="w-50 mx-auto bg-primary mt-0" />
                <p className="mb-0">
                  Complete our simple verification process to become a trusted partner.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.3s">
              <div className="position-relative border border-primary pt-5 pb-4 px-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: 100, height: 100 }}>
                  <i className="fa fa-upload fa-3x text-white" />
                </div>
                <h5 className="mt-4">Add Your Programs</h5>
                <hr className="w-25 mx-auto bg-primary mb-1" />
                <hr className="w-50 mx-auto bg-primary mt-0" />
                <p className="mb-0">
                  Upload your tours with photos, descriptions, and pricing details.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp" data-wow-delay="0.5s">
              <div className="position-relative border border-primary pt-5 pb-4 px-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow" style={{ width: 100, height: 100 }}>
                  <i className="fa fa-calendar-check fa-3x text-white" />
                </div>
                <h5 className="mt-4">Start Accepting Bookings</h5>
                <hr className="w-25 mx-auto bg-primary mb-1" />
                <hr className="w-50 mx-auto bg-primary mt-0" />
                <p className="mb-0">
                  Manage bookings, communicate with travelers, and grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works for Agencies End */}
      
      {/* CTA Section Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-primary rounded p-4">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="text-white mb-0">Ready to Grow Your Travel Business?</h2>
                <p className="text-white mb-0">Join hundreds of agencies already benefiting from our platform.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/agency-register" className="btn btn-dark rounded-pill py-2 px-4">
                  Register Your Agency Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section End */}
    </div>
  );
};

export default AgencyHome;