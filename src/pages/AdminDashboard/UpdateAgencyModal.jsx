import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Avatar,
  CircularProgress,
  Slide,
} from "@mui/material";
import { Close as CloseIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import api from "../../api/axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateAgencyModal = ({ open, onClose, onSuccess, agency }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    type: "agency",
    status: "pending",
    profile_photo_path: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-quart",
      once: true,
    });
  }, []);

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || "",
        email: agency.user?.email || agency.email || "",
        phone_number: agency.user?.phone_number || agency.phone || "",
        type: agency.type || "agency",
        status: agency.status || "pending",
        profile_photo_path: null,
      });
      setPreviewImage(agency.user?.profile_photo_path || agency.logo || null);
    }
  }, [agency]);

  const validate = () => {
    const newErrors = {};
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_photo_path: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agency || (!agency.id && !agency.agencyId)) {
      Swal.fire({
        title: "Error!",
        text: "Agency information is not available",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (formData.name) formDataToSend.append("name", formData.name);
      if (formData.email) formDataToSend.append("email", formData.email);
      if (formData.phone_number) formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("status", formData.status);
      if (formData.profile_photo_path) {
        formDataToSend.append("profile_photo_path", formData.profile_photo_path);
      }

      const agencyId = agency.agencyId || agency.id;
      const response = await api.post(
        `api/admin/update-agency/${agencyId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Agency updated successfully",
        icon: "success",
        confirmButtonColor: "#86b817",
        timer: 2000,
        timerProgressBar: true,
      });

      onSuccess(response.data.agency);
      onClose();
    } catch (error) {
      console.error("Error updating agency:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update agency. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setPreviewImage(null);
    onClose();
  };

  if (!agency || (!agency.id && !agency.agencyId)) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>Agency data is not available</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
      data-aos="zoom-in"
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 3,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Update Agency
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, overflowY: "auto" }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="profile-photo-upload"
            />
            <label htmlFor="profile-photo-upload">
              <Box sx={{ position: "relative", cursor: "pointer" }}>
                <Avatar
                  src={previewImage || "/images/default-avatar.png"}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "2px solid #86b817",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <UploadIcon sx={{ color: "white", fontSize: 30 }} />
                </Box>
              </Box>
            </label>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Agency Name"
              name="name"
              margin="normal"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              margin="normal"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              margin="normal"
              variant="outlined"
              value={formData.phone_number}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value="agency">Agency</MenuItem>
                <MenuItem value="club">Club</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: "grey.100",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 3,
            mr: 2,
            "&:hover": {
              bgcolor: "grey.200",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            px: 4,
            bgcolor: "#86b817",
            "&:hover": {
              bgcolor: "#7aa814",
            },
          }}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting ? "Updating..." : "Update Agency"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAgencyModal;