"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Box, Tabs, Tab, CircularProgress, Typography } from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import MyToursTable from "./ToursTable";
import AgencyBookingsTable from "./BookingsTable";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ title, value, change, period, icon, loading }) => {
  const isPositive = change > 0;
  const changeColor = isPositive
    ? "text-success bg-success-subtle"
    : "text-danger bg-danger-subtle";
  const sign = isPositive ? "+" : "";

  return (
    <div className="card shadow-sm h-100 border-0" data-aos="fade-up">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="text-muted mb-3">{title}</h6>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <h3 className="fw-bold mb-0">{value}</h3>
            )}
          </div>
          <div className="bg-primary bg-opacity-10 p-2 rounded">{icon}</div>
        </div>
        {change !== null && (
          <div className="d-flex align-items-center">
            <span className={`badge rounded-pill ${changeColor} me-2`}>
              {sign}
              {change}%
            </span>
            <small className="text-muted">{period}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/agency/stats");
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load statistics");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const { user, loading: authLoading } = useAuth();

  // في حالة auth مازال يجيب البيانات
  if (authLoading || loading) {
    return (
      <Box className="min-vh-100 d-flex justify-content-center align-items-center">
        <CircularProgress />
      </Box>
    );
  }

  /* If user is an agency but their status is not approved
if (user?.role === "agency" && user.agency?.status !== "approved") {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
        backgroundColor: 'background.paper'
      }}
    >
      <PendingActionsIcon 
        color="warning" 
        sx={{ 
          fontSize: 64, 
          mb: 3 
        }} 
      />
      
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          mb: 2
        }}
      >
        Your Agency Account is Under Review
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          maxWidth: 500,
          mb: 3
        }}
      >
        Thank you for submitting your agency registration. Our team is currently reviewing your application. 
        This process typically takes 1-3 business days.
      </Typography>
      
      <CircularProgress color="warning" size={24} />
      
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          mt: 3,
          fontStyle: 'italic'
        }}
      >
        You'll receive a notification once your account is approved.
      </Typography>
    </Box>
  );
}*/

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container-fluid">
        {/* Statistics Cards Row */}
        <div className="row g-4 mb-4">
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
            <StatCard
              title="Total Bookings"
              value={stats?.total_bookings || "0"}
              change={5}
              period="vs last month"
              icon={<i className="fas fa-calendar-check fs-4 text-primary"></i>}
              loading={loading}
            />
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
            <StatCard
              title="Unique Tourists"
              value={stats?.total_unique_tourists || "0"}
              change={12}
              period="vs last month"
              icon={<i className="fas fa-users fs-4 text-primary"></i>}
              loading={loading}
            />
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <StatCard
              title="Total Income"
              value={stats?.total_income ? `${stats.total_income} DA` : "0 DA"}
              change={8}
              period="vs last month"
              icon={
                <i className="fas fa-money-bill-wave fs-4 text-primary"></i>
              }
              loading={loading}
            />
          </div>
          <div className="col-md-3" data-aos="fade-up" data-aos-delay="400">
            <StatCard
              title="Active Tours"
              value={stats?.total_tours || "0"}
              change={2}
              period="vs last month"
              icon={<i className="fas fa-map-marked-alt fs-4 text-primary"></i>}
              loading={loading}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="row g-4">
          <div className="col-12" data-aos="fade-up" data-aos-delay="300">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-0">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="My Tours" />
                    <Tab label="My Bookings" />
                  </Tabs>
                </Box>
                <div className="p-3">
                  {activeTab === 0 && <MyToursTable />}
                  {activeTab === 1 && <AgencyBookingsTable />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
