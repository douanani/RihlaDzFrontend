import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">
        <Card className="shadow-lg border-0">
          <Card.Header 
            className="text-white" 
            style={{ backgroundColor: '#4a6bff', borderBottom: '3px solid #86b817' }}
          >
            <h1 className="mb-0 text-center">Terms & Conditions</h1>
          </Card.Header>
          
          <Card.Body className="p-4 p-md-5">
            <div className="terms-content" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>1. Introduction</h4>
              <p className="mb-4">
                Welcome to our tourism platform. By accessing or using our services as a tourist, agency, or adventure club, you agree to be bound by these terms. If you disagree, please do not use our services.
              </p>
              
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>2. User Roles & Responsibilities</h4>
              <p className="mb-4">
                - <strong>Agencies</strong> are responsible for the accuracy and legality of the tour packages they publish.<br />
                - <strong>Tourists</strong> must provide valid information when booking and respect the agency's terms.<br />
                - <strong>Admins</strong> have the right to manage content, suspend accounts, and oversee activity on the platform.
              </p>
              
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>3. Booking Policy</h4>
              <p className="mb-4">
                All bookings are subject to availability. Confirmation will be sent via notification. Users must cancel or confirm bookings before the deadline set by the agency. Late cancellations may result in restrictions.
              </p>
              
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>4. Content Ownership</h4>
              <p className="mb-4">
                Agencies and adventure clubs retain full ownership of the content they publish. However, by uploading content to our platform, you grant us the right to display and promote it on our site and social media.
              </p>
              
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>5. Account Suspension</h4>
              <p className="mb-4">
                We reserve the right to suspend any account involved in fraudulent activity, misleading information, or violation of any terms stated here.
              </p>
              
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>6. Liability Disclaimer</h4>
              <p className="mb-4">
                The platform is a mediator between agencies and tourists. We are not responsible for any disputes, damages, or losses caused by agencies or users. Agencies are solely responsible for their offers and execution.
              </p>
              
              <h4 className="mb-4" style={{ color: '#4a6bff' }}>7. Updates to Terms</h4>
              <p className="mb-4">
                These terms may be updated without prior notice. It is the responsibility of the users to review them periodically.
              </p>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="agreeTerms" style={{ accentColor: '#86b817' }} />
                <label className="form-check-label" htmlFor="agreeTerms">
                  I have read and agree to the Terms & Conditions
                </label>
              </div>
              <Button 
                variant="primary" 
                style={{ backgroundColor: '#86b817', borderColor: '#86b817' }}
                className="px-4 py-2"
              >
                Continue
              </Button>
            </div>
          </Card.Body>
          
          <Card.Footer className="text-muted text-center" style={{ backgroundColor: '#f8f9fa' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
