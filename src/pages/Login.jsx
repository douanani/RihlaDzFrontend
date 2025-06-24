import React, { useState } from "react";
import {
  TextField,
  Typography,
  Link,
  Button,
  Paper,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";
import api from "../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { setUser } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get CSRF token first
      await api.get("/sanctum/csrf-cookie");

      // Login request
      const response = await api.post("/api/login", formData);
      setUser(response.data.user);
    if (response.data.user.role === "agency"|| response.data.user.role === "club") {
        navigate("/agency-home"); }
    else {
        navigate("/");}
      
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.message || "Please check your credentials",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0a0f2c, #0f1f4b)"
            : "linear-gradient(135deg, #d6e4f9, #f0f6ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      {/* Home Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <Link href="/" sx={{ textDecoration: "none", color: "#0d6efd" }}>
          <HomeIcon sx={{ fontSize: 32 }} />
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 1000 }}
      >
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: 500,
            borderRadius: 6,
            overflow: "hidden",
            backdropFilter: "blur(12px)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(10, 20, 40, 0.85)"
                : "rgba(255, 255, 255, 0.5)",
            boxShadow: "0 8px 24px rgba(0, 98, 255, 0.2)",
          }}
        >
          {/* Left Side - Form */}
          <Box sx={{ flex: 1, p: 5 }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <LocationOnIcon fontSize="large" sx={{ color: "#86B817", mr: 0 }} />
                <Typography variant="h4" fontWeight="bold" color="#0d6efd">
                  RihlaDZ
                </Typography>
              </Box>

              <Typography variant="h5" mb={2} sx={{ color: "#0d6efd", fontWeight: 600 }}>
                Welcome Back!
              </Typography>

              <Typography variant="body1" mb={3} color="text.secondary">
                Log in to access amazing tours and adventures.
              </Typography>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  label="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    borderRadius: "30px",
                    background: "#0d6efd",
                    fontWeight: "bold",
                    height: 44,
                    "&:hover": {
                      background: "#0056d2",
                    },
                    "&.Mui-disabled": {
                      background: "#e0e0e0",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography variant="body2" align="center" mt={3}>
                <Link
                  href="/reset-password"
                  underline="hover"
                  sx={{ color: "#0d6efd" }}
                >
                  Forgot password?
                </Link>
              </Typography>

              <Typography variant="body2" align="center" mt={1}>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: "#0d6efd" }}
                >
                  Register here
                </Link>
              </Typography>
            </motion.div>
          </Box>

          {/* Right Side - Image */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              backgroundImage: 'url("/assets/img/login.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </Paper>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#0d6efd" }}
            />
          </motion.div>
        </Box>
      )}
    </Box>
  );
}

export default Login;