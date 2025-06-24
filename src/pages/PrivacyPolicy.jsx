import React from "react";
import { Container } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" className="py-5">
      <div className="bg-light p-4 p-md-5 shadow rounded-4">
        <h2 className="mb-4 text-center fw-bold text-primary">
          Privacy Policy
        </h2>

        <p className="lead">
          At <strong>Tourify</strong>, we are committed to protecting your
          personal information and ensuring transparency in how your data is
          collected, used, and shared.
        </p>

        <hr className="my-4" />

        <h4 className="text-dark">1. Information We Collect</h4>
        <ul className="list-unstyled ps-3">
          <li>• Name, email, and contact information</li>
          <li>• Travel preferences and booking history</li>
          <li>• Login and account details</li>
        </ul>

        <h4 className="mt-4 text-dark">2. How We Use Your Data</h4>
        <ul className="list-unstyled ps-3">
          <li>• Provide personalized tour recommendations</li>
          <li>• Manage bookings and user accounts</li>
          <li>• Improve your experience on the platform</li>
          <li>• Communicate offers and updates</li>
        </ul>

        <h4 className="mt-4 text-dark">3. Data Sharing</h4>
        <p>We do not sell your data. We may share it only with:</p>
        <ul className="list-unstyled ps-3">
          <li>• Trusted tour agencies you book with</li>
          <li>• Technical service providers under strict confidentiality</li>
          <li>• Authorities if legally required</li>
        </ul>

        <h4 className="mt-4 text-dark">4. Security</h4>
        <p>
          We use encryption, authentication, and secure servers to protect your
          personal information.
        </p>

        <h4 className="mt-4 text-dark">5. Cookies</h4>
        <p>
          We use cookies to improve your browsing experience. You can disable
          them via your browser settings.
        </p>

        <h4 className="mt-4 text-dark">6. Your Rights</h4>
        <ul className="list-unstyled ps-3">
          <li>• Access or update your personal information</li>
          <li>• Request deletion of your account or data</li>
          <li>• Withdraw consent at any time</li>
        </ul>

        <h4 className="mt-4 text-dark">7. Contact</h4>
        <p>
          If you have any questions about this policy, please contact us at:{" "}
          <br />
          📧 <strong>support@tourify.com</strong>
        </p>

        <div className="text-end text-secondary mt-5">
          <small>Last updated: May 26, 2025</small>
        </div>
      </div>
    </Container>
  );
}
