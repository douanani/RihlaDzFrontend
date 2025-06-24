import React, { useMemo, useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./api/axios"; // Adjust the path as necessary
// index.js أو App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Tours from "./pages/Tours";
import Destination from "./pages/Destination";
import Booking from "./pages/Booking";
import Team from "./pages/Team";
import Testimonial from "./pages/Testimonial";
import Error from "./pages/Error";
import Contact from "./pages/Contact";
import TourPage from "./pages/TourPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountSettings from "./pages/Profile/AccountSettings";
import AgencyDashboard from "./pages/AgencyDashboard/AgencyDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ResetPassword from "./pages/RestPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider } from "./context/AuthContext";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import TouristDashboard from "./pages/TouristDashboard/TouristDashboard"; // Import Favorites page
import AgencyProfile from "./pages/AgencyProfile";
import AgencyHomePage from "./pages/AgencyHomePage"; // Import Agency Home Page

export default function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const savedMode = localStorage.getItem("mode") || "light";
  const [mode, setMode] = useState(savedMode);

  useEffect(() => {
    api.get("/sanctum/csrf-cookie");
    api.get("/api/tours"); // تقدر تحذف هذا كي تستعمل React Query
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

 const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,      // تعتبر الداتا صالحة 10 دق
      cacheTime: 1000 * 60 * 15,      // تبقى في الكاش 15 دق بعد مغادرة الصفحة
      refetchOnWindowFocus: false,   // ما يعاودش يجلب كي ترجع للتاب
      refetchOnMount: false,         // ما يعاودش يجلب كي تعاود تدخل نفس الصفحة
      refetchOnReconnect: false,     // ما يعاودش يجلب كي يرجع الاتصال
    },
  },
});
 // 👈 هنا أنشأنا client

  return (
    <QueryClientProvider client={queryClient}> {/* 👈 هنا غلفنا كامل المشروع */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          {!isAuthPage && (
            <Header mode={mode} toggleColorMode={toggleColorMode} />
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/Tours" element={<Tours />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/team" element={<Team />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tourDetails/:tourId" element={<TourPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/agency-dashboard" element={<AgencyDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/my-dashboard" element={<TouristDashboard />} />
            <Route path="/agency-profile/:agencyId" element={<AgencyProfile />} />
            <Route path="/agency-home" element={<AgencyHomePage />} />
            
            {/* Routes for Agency Dashboard */}
            <Route path="*" element={<Error />} />
          </Routes>

          <ToastContainer />
          {!isAuthPage && <Footer />}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
