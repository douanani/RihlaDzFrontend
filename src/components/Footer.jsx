import React from 'react'
import { Box, Typography, Link, Container } from "@mui/material";


export default function Footer() {
  return (
    <div>
          {/* Footer Start */}
          <div
            className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn"
            data-wow-delay="0.1s"
          >
            <div className="container py-5">
              <div className="row g-5 justify-content-center">
                <div className="col-lg-3 col-md-6">
                  <h4 className="text-white mb-3">Company</h4>
                  <a className="btn btn-link" href="/about">
                    About Us
                  </a>
                  <a className="btn btn-link" href="/contact">
                    Contact Us
                  </a>
                  <a className="btn btn-link" href="/privacy-policy">
                    Privacy Policy
                  </a>
                  <a className="btn btn-link" href="/terms-and-conditions">
                    Terms &amp; Condition
                  </a>
                  <a className="btn btn-link" href="/">
                    FAQs &amp; Help
                  </a>
                </div>
                <div className="col-lg-3 col-md-6">
                  <h4 className="text-white mb-3">Contact</h4>
                  <p className="mb-2">
                    <i className="fa fa-map-marker-alt me-3" />
                    Mansourah, Tlemcen, Algeria
                  </p>
                  <p className="mb-2">
                    <i className="fa fa-phone-alt me-3" />
                    +213 554 301 727
                  </p>
                  <p className="mb-2">
                    <i className="fa fa-envelope me-3" />
                    info@rihladz.com
                  </p>
                  <div className="d-flex pt-2">
                    <a className="btn btn-outline-light btn-social" href="/">
                      <i className="fab fa-twitter" />
                    </a>
                    <a className="btn btn-outline-light btn-social" href="/">
                      <i className="fab fa-facebook-f" />
                    </a>
                    <a className="btn btn-outline-light btn-social" href="">
                      <i className="fab fa-youtube" />
                    </a>
                    <a className="btn btn-outline-light btn-social" href="">
                      <i className="fab fa-linkedin-in" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <h4 className="text-white mb-3">Gallery</h4>
                  <div className="row g-2 pt-2">
                    <div className="col-4">
                      <img
                        className="img-fluid bg-light p-1"
                        src="assets/img/package-1.jpg"
                        alt=""
                      />
                    </div>
                    <div className="col-4">
                      <img
                        className="img-fluid bg-light p-1"
                        src="assets/img/package-2.jpg"
                        alt=""
                      />
                    </div>
                    <div className="col-4">
                      <img
                        className="img-fluid bg-light p-1"
                        src="assets/img/package-3.jpg"
                        alt=""
                      />
                    </div>
                    <div className="col-4">
                      <img
                        className="img-fluid bg-light p-1"
                        src="assets/img/package-2.jpg"
                        alt=""
                      />
                    </div>
                    <div className="col-4">
                      <img
                        className="img-fluid bg-light p-1"
                        src="assets/img/package-3.jpg"
                        alt=""
                      />
                    </div>
                    <div className="col-4">
                      <img
                        className="img-fluid bg-light p-1"
                        src="assets/img/package-1.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="copyright">
                <div className="row justify-content-center">
  <div className="col-md-8 text-center mb-3 mb-md-0">
    ©{" "}
    <a className="border-bottom" href="#">
      RihlaDz
    </a>
    , All Right Reserved.
    Designed By{" "}
    <a className="border-bottom" href="https://github.com/douanani">
      Djilali Ouanani
    </a>
  </div>
</div>

              </div>
            </div>
          </div>
          {/* Footer End */}
    </div>
  )
}
