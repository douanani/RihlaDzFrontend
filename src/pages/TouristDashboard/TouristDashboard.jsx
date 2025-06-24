"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import MyBookings from "./MyBookings";
import MyFavorites from "./Favorites";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

 

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container-fluid">

        {/* Main Content */}
        <div className="row g-4">
          <div className="col-12" data-aos="fade-up" data-aos-delay="300">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-0">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="My Bookings" />
                    <Tab label="My Favorites" />
                  </Tabs>
                </Box>
                <div className="p-3">
                  {activeTab === 0 && <MyBookings/>}
                  {activeTab === 1 && <MyFavorites/>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}