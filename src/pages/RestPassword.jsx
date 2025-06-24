import React from "react";
import {
  Container,
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

function ForgotPassword() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e, #16213e)"
            : "linear-gradient(135deg, #e0eafc, #cfdef3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 1000 }}
      >
        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: 500,
            borderRadius: 4,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            background:
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.6)"
                : "rgba(255, 255, 255, 0.4)",
          }}
        >
          {/* Left side */}
          <Box sx={{ flex: 1, p: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <LocationOnIcon
                fontSize="large"
                sx={{ color: "#0d6efd", mr: 1 }}
              />
              <Typography variant="h4" fontWeight="bold">
                RihlaDZ
              </Typography>
            </Box>

            <Typography variant="h5" mb={3} color="text.secondary">
              Forgot your password?
            </Typography>

            <Typography variant="body2" mb={2} color="text.secondary">
              Enter your email address below and we’ll send you a link to reset
              your password.
            </Typography>

            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Send Reset Link
            </Button>

            <Typography variant="body2" align="center" mt={3}>
              Remember your password?{" "}
              <Link href="/login" underline="hover">
                Login here
              </Link>
            </Typography>
          </Box>

          {/* Right side - Image */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "block" },
              backgroundImage: 'url("/assets/img/rest-password.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Paper>
      </motion.div>
    </Box>
  );
}

export default ForgotPassword;
