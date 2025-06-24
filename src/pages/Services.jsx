import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

function Services() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div className="services-page">
      {/* Hero Section - Smaller Height */}
      <div className="hero-section position-relative overflow-hidden" style={{ minHeight: '40vh' }}>
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="container position-relative z-index-1 py-4">
          <div 
            className="row justify-content-center align-items-center py-4"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <div className="col-lg-8 text-center py-3">
              <h1 className="display-5 fw-bold text-white mb-2">Our Services</h1>
              <p className="lead text-light mb-3">Premium travel experiences tailored just for you</p>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-white-50">Home</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    Services
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div 
            className="text-center mb-5"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h6 className="section-subtitle text-uppercase text-primary mb-3">What We Offer</h6>
            <h1 className="display-6 mb-4">Explore Our Premium Services</h1>
            <p className="w-75 mx-auto text-muted">
              We provide comprehensive solutions to make your travel planning seamless and enjoyable
            </p>
          </div>
          
          <div className="row g-4">
            {/* Service 1 */}
            <div 
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="service-card card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <i className="fas fa-globe fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Verified Travel Programs</h5>
                  <p className="text-muted mb-0">
                    Browse a wide selection of trusted travel programs offered by certified agencies and adventure clubs.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div 
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="service-card card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <i className="fas fa-user-circle fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Traveler Profile</h5>
                  <p className="text-muted mb-0">
                    Sign up as a traveler, personalize your preferences, and choose trips that match your interests.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div 
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="service-card card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <i className="fas fa-chart-line fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Agency Dashboard</h5>
                  <p className="text-muted mb-0">
                    A dashboard for agencies and clubs to easily publish, update, and manage their tour programs.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div 
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="service-card card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <i className="fas fa-calendar-check fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Real-Time Booking</h5>
                  <p className="text-muted mb-0">
                    Instantly book your spot or send a request for more info—no delays, just smooth planning.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div 
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="service-card card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <i className="fas fa-filter fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Customized Filters</h5>
                  <p className="text-muted mb-0">
                    Use filters to find trips based on location, departure date and duration.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 6 */}
            <div 
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="service-card card h-100 border-0 shadow-sm hover-shadow transition-all">
                <div className="card-body p-4 text-center">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <i className="fas fa-star fa-2x"></i>
                  </div>
                  <h5 className="mb-3">Reviews & Ratings</h5>
                  <p className="text-muted mb-0">
                    Travelers can leave feedback and rate their experiences, helping others choose the best programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="bg-primary text-white py-5"
        data-aos="fade-up"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <h3 className="mb-2">Ready to start your adventure?</h3>
              <p className="mb-0">Join thousands of travelers who've already discovered amazing experiences with us.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <a href="/contact" className="btn btn-light btn-lg px-4 rounded-pill">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;