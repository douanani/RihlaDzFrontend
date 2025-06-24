import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Nav, Tab, Card, Spinner, Alert } from "react-bootstrap";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../../api/axios"; // Adjust the import path as necessary

const provinces = [
  { code: "01", name: "Adrar" },
  { code: "02", name: "Chlef" },
  // ... rest of the provinces
];

export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState(null);
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quart',
      once: true
    });

    // Set initial form data if user exists
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        province: user.province || "",
      });
    }
  }, [user]);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));

      // Upload to server
      const formData = new FormData();
      formData.append('profile_photo_path', file);

      try {
        await api.post('/api/user/profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // Optionally refresh user data
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await api.put('/api/user/update', {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        location: formData.province,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle errors (e.g., show error message to user)
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordWarning("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordWarning("Password must be at least 8 characters long.");
      return;
    }

    setPasswordWarning("");

    try {
      const response = await api.put("/api/user/password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      const Swal = await import("sweetalert2");
      Swal.default.fire({
        icon: "success",
        title: "Password Updated",
        text: response.data.message || "Your password has been updated successfully.",
        confirmButtonColor: "#0d6efd",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred while updating the password.";

      const Swal = await import("sweetalert2");
      Swal.default.fire({
        icon: "error",
        title: "Update Failed",
        text: message,
        confirmButtonColor: "#dc3545",
      });

      console.error("Error updating password:", error);
    }
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Card className="shadow-lg overflow-hidden" data-aos="fade-up">
        <Card.Body className="p-0">
          <Row className="g-0">
            {/* Profile Picture */}
            <Col md={4} className="bg-light p-4 text-center">
              <div data-aos="zoom-in" data-aos-delay="100">
                <img
                  src={profileImage || `http://localhost:8000/storage/${user.profile_photo_path}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:8000/storage/images/default_PP.jpg";
                  }}
                  className="rounded-circle shadow mb-3"
                  width="150"
                  height="150"
                  alt="profile"
                  style={{ objectFit: "cover" }}
                />
                <div className="mt-3">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    id="profileImage"
                    className="d-none"
                  />
                  <label htmlFor="profileImage" className="btn btn-outline-primary w-100">
                    Change Photo
                  </label>
                </div>
                <h4 className="mt-3 mb-0">{user?.name}</h4>
                <p className="text-muted">{user?.email}</p>
              </div>
            </Col>

            {/* Tabs and Forms */}
            <Col md={8} className="p-4">
              <Tab.Container defaultActiveKey="settings">
                <Nav variant="tabs" className="mb-4">
                  <Nav.Item data-aos="fade-right" data-aos-delay="150">
                    <Nav.Link eventKey="settings" className="fw-bold">
                      <i className="bi bi-person-fill me-2"></i>Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item data-aos="fade-right" data-aos-delay="200">
                    <Nav.Link eventKey="security" className="fw-bold">
                      <i className="bi bi-shield-lock me-2"></i>Security
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Account Settings Tab */}
                  <Tab.Pane eventKey="settings">
                    {saveSuccess && (
                      <Alert variant="success" className="mb-4" data-aos="fade-down">
                        Profile updated successfully!
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="100">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Full name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your name"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Phone Number</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Enter phone number"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Province</Form.Label>
                        <Form.Select
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                        >
                          <option value="">Select your province</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.name}>
                              {province.code} - {province.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <div className="d-grid gap-2 mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span className="ms-2">Saving...</span>
                            </>
                          ) : "Save Changes"}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  {/* Security Tab */}
                  <Tab.Pane eventKey="security">
                    <h5 className="mb-4 fw-bold" data-aos="fade-down">
                      <i className="bi bi-shield-lock me-2"></i>Security Settings
                    </h5>

                    <Form onSubmit={handlePasswordSubmit} data-aos="fade-up" data-aos-delay="100">
                      <Form.Group className="mb-3" data-aos="fade-up" data-aos-delay="150">
                        <Form.Label className="fw-bold">Current Password</Form.Label>
                        <div className="input-group">
                          <Form.Control
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowCurrentPassword(v => !v)}
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" data-aos="fade-up" data-aos-delay="200">
                        <Form.Label className="fw-bold">New Password</Form.Label>
                        <div className="input-group">
                          <Form.Control
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowNewPassword(v => !v)}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" data-aos="fade-up" data-aos-delay="250">
                        <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                        <div className="input-group">
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={!!passwordWarning}
                            required
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowConfirmPassword(v => !v)}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </button>
                        </div>
                        {passwordWarning && (
                          <Form.Text className="text-danger">{passwordWarning}</Form.Text>
                        )}
                      </Form.Group>

                      <div className="d-grid gap-2 mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          data-aos="fade-up"
                          data-aos-delay="300"
                        >
                          Update Password
                        </Button>
                      </div>
                    </Form>

                    <hr className="my-4" />

                    <div className="text-center" data-aos="fade-up" data-aos-delay="350">
                      <p className="mb-3 fw-bold">Forgot your password?</p>
                      <Button
                        variant="outline-danger"
                        href="/forgot-password"
                        className="px-4"
                      >
                        <i className="bi bi-key me-2"></i>Reset Password
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}