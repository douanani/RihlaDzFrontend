import React, { useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AgenciesTable from "./AgenciesTable";
import TouristsTable from "./TouristsTable";
import MessagesTable from "./MessagesTable";
import ReportsTable from "./ReportsTable";
import CategoriesTable from "./CategoriesTable";
import api from "../../api/axios";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_agencies: 0,
    total_tourists: 0,
    active_bookings: 0,
    revenue: 0,
    loading: true,
  });

  const [activeTab, setActiveTab] = useState("agencies");

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/stats");
      setStats({
        total_agencies: response.data.total_agencies || 0,
        total_tourists: response.data.total_users || 0,
        active_bookings: response.data.total_bookings || 0,
        revenue: response.data.total_tours || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      Swal.fire("Error", "Failed to load statistics", "error");
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-quart",
      once: true,
    });
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (stats.loading) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Page Header */}
      <Row className="mb-4 justify-content-center" data-aos="fade-down">
        <Col md="auto">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h3 className="section-title bg-white text-center text-primary px-3">
              Admin Dashboard
            </h3>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4" data-aos="fade-up">
        <Col md={3}>
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Agencies</h6>
                  <h3 className="mb-0">{stats.total_agencies}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-building text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Tourists</h6>
                  <h3 className="mb-0">{stats.total_tourists}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-people text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Bookings</h6>
                  <h3 className="mb-0">{stats.active_bookings}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-calendar-check text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className="card shadow-sm border-0 rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Tours</h6>
                  <h3 className="mb-0">{stats.revenue}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-bag-dash-fill text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Tabbed Interface */}
      <Row data-aos="fade-up">
        <Col>
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <div className="card-header bg-white border-bottom p-0">
                <Nav variant="tabs" className="flex-nowrap" as="ul">
                  <Nav.Item as="li">
                    <Nav.Link eventKey="agencies" className="py-3 px-4">
                      <i className="bi bi-building me-2"></i>
                      Agencies & Clubs
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="tourists" className="py-3 px-4">
                      <i className="bi bi-people me-2"></i>
                      Tourists
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="messages" className="py-3 px-4">
                      <i className="bi bi-inboxes-fill me-2"></i>
                      Inbox
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="reports" className="py-3 px-4">
                      <i className="bi bi-inboxes-fill me-2"></i>
                      Reports
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="categories" className="py-3 px-4">
                      <i className="bi bi-tags-fill me-2"></i>
                      Categories
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
              <div className="card-body p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="agencies" className="p-0">
                    <AgenciesTable />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tourists" className="p-0">
                    <TouristsTable />
                  </Tab.Pane>
                  <Tab.Pane eventKey="messages" className="p-0">
                    <MessagesTable />
                  </Tab.Pane>
                  <Tab.Pane eventKey="reports" className="p-0">
                    <ReportsTable />
                  </Tab.Pane>
                  <Tab.Pane eventKey="categories" className="p-0">
                    <CategoriesTable />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </Col>
      </Row>

      {/* Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css"
      />
    </Container>
  );
};

export default AdminDashboard;
