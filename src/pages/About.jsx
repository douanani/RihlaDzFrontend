import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div>
      {/* Hero Header
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown" data-aos="fade-down">
                About Us
              </h1>
              <nav aria-label="breadcrumb" data-aos="fade-up" data-aos-delay="200">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-white">Home</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    About
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div> */}

      {/* About Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div 
              className="col-lg-6"
              data-aos="fade-right"
              data-aos-delay="100"
              style={{ minHeight: 400 }}
            >
              <div className="position-relative h-100 rounded overflow-hidden">
                <img
                  className="img-fluid position-absolute w-100 h-100"
                  src="assets/img/about.jpg"
                  alt="About Us"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
              <h6 className="section-title bg-white text-start text-primary pe-3">
                About Us
              </h6>
              <h1 className="mb-4">
                Welcome to <span className="text-primary">RihlaDZ</span>
              </h1>
              <p className="mb-4" data-aos="fade-up" data-aos-delay="300">
                RihlaDZ is a platform that connects tourists with top travel agencies and adventure clubs across the country. Whether you're looking for a relaxing getaway or a thrilling outdoor experience, we help you find the perfect trip.
              </p>
              <p className="mb-4" data-aos="fade-up" data-aos-delay="350">
                Our mission is to make travel planning easy and accessible for everyone. Browse offers, book online, and join exciting programs organized by verified partners.
              </p>
              <div className="row gy-2 gx-4 mb-4">
                {[
                  "Verified Travel Agencies",
                  "Adventure Clubs Access",
                  "Online Booking System",
                  "Wide Range of Activities",
                  "Secure Payment Methods",
                  "24/7 Customer Support"
                ].map((item, index) => (
                  <div className="col-sm-6" key={index} data-aos="fade-up" data-aos-delay={400 + (index * 50)}>
                    <p className="mb-0">
                      <i className="fa fa-arrow-right text-primary me-2" />
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <a 
                className="btn btn-primary py-3 px-5 mt-2" 
                href="#"
                data-aos="zoom-in"
                data-aos-delay="700"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center" data-aos="fade-down">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Our Team
            </h6>
            <h1 className="mb-5">Meet Our Team</h1>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: "Djilali Ouanani", role: "Web Developer" },
              { name: "Bouchenafa Djaber", role: "Web Developer" }
            ].map((member, index) => (
              <div 
                className="col-lg-3 col-md-6" 
                key={index}
                data-aos="flip-up"
                data-aos-delay={index * 200}
              >
                <div className="team-item">
                  <div className="overflow-hidden rounded-top">
                    <img 
                      className="img-fluid" 
                      src="assets/img/team.png" 
                      alt={member.name} 
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-19px" }}
                  >
                    {['facebook-f', 'twitter', 'instagram'].map((social, i) => (
                      <a 
                        key={i}
                        className="btn btn-square mx-1 bg-primary text-white"
                        href="#"
                        data-aos="zoom-in"
                        data-aos-delay={800 + (i * 100)}
                      >
                        <i className={`fab fa-${social}`} />
                      </a>
                    ))}
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">{member.name}</h5>
                    <small>{member.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;