import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // ربط مع API
    setMessage("If this email exists, a reset link was sent.");
    setEmail("");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="text-center mb-3">Reset Your Password</h4>
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Send Reset Link
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
