// src/pages/Register.jsx
import React, { useState } from "react";
import {
  TextField,
  Typography,
  Link,
  Button,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";
import api from "../api/axios";
import Swal from "sweetalert2";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";


function Register() {
  const theme = useTheme();
    const navigate = useNavigate();
  

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    role: "",
    verification_agreement: null, // الملف
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, verification_agreement: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
      formData.append("phone_number", form.phone_number);
      formData.append("role", form.role);

      if (form.role === "agency" || form.role === "club") {
        formData.append("verification_agreement", form.verification_agreement);
      }

      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success", "Registration completed successfully!", "success");
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
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
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "#0d6efd" }}>
          <HomeIcon sx={{ fontSize: 32 }} />
        </Link>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 1000, minHeight: 550 }}
      >
        <Paper
          elevation={10}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: 550,
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
          {/* Left form */}
          <Box sx={{ flex: 1, p: 5 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <LocationOnIcon
                fontSize="large"
                sx={{ color: "#86B817", mr: 0 }}
              />
              <Typography variant="h4" fontWeight="bold" color="#0d6efd">
                RihlaDZ
              </Typography>
            </Box>

            <Typography
              variant="h5"
              mb={2}
              sx={{ color: "#0d6efd", fontWeight: 600 }}
            >
              Create your account
            </Typography>

            <Typography variant="body1" mb={3} color="text.secondary">
              Join us and start exploring tours across Algeria.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                size="small"
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                size="small"
                required
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                size="small"
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                name="password_confirmation"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                value={form.password_confirmation}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                margin="normal"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="tourist">Tourist</option>
                <option value="agency">Agency</option>
                <option value="club">Club</option>
              </TextField>

              {(form.role === "agency" || form.role === "club") && (
                <Box mt={2}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Upload your agreement (PDF)
                  </Typography>
                  <input
                    type="file"
                    name="verification_agreement"
                    accept="application/pdf"
                    required
                    onChange={handleFileChange}
                  />
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  borderRadius: "30px",
                  background: "#0d6efd",
                  fontWeight: "bold",
                  "&:hover": { background: "#0056d2" },
                }}
              >
                Register
              </Button>
            </form>

            <Typography variant="body2" align="center" mt={3}>
              Already have an account?{" "}
              <Link href="/login" underline="hover" sx={{ color: "#0d6efd" }}>
                Log in here
              </Link>
            </Typography>
          </Box>

          {/* Right image */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              backgroundImage: 'url("/assets/img/register.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Register;
