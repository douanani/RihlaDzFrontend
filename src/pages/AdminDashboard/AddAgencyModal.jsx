import React, { useState } from 'react';
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
  FormHelperText,
  IconButton,
  Avatar,
  CircularProgress,
  Slide
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Transition for modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddAgencyModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    role: 'agency',
    profile_photo_path: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize AOS
  React.useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quart',
      once: true
    });
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_photo_path: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.password_confirmation);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('role', formData.role);
      if (formData.profile_photo_path) {
        formDataToSend.append('profile_photo_path', formData.profile_photo_path);
      }

      const response = await api.post('api/admin/add-agency', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      Swal.fire({
        title: 'Success!',
        text: 'Agency added successfully',
        icon: 'success',
        confirmButtonColor: '#86b817',
        timer: 2000,
        timerProgressBar: true,
      });

      // Reset form and close modal
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding agency:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add agency. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone_number: '',
      role: 'agency',
      profile_photo_path: null,
    });
    setErrors({});
    setPreviewImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: '90vh' // Changed from fixed height to viewport height
        }
      }}
      data-aos="zoom-in"
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Add New Agency
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, overflowY: 'auto' }}>
        <Box sx={{ p: 3 }}>
          {/* Profile Photo Upload */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="profile-photo-upload"
            />
            <label htmlFor="profile-photo-upload">
              <Box
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover .MuiAvatar-root': {
                    opacity: 0.8
                  },
                  '&:hover .upload-overlay': {
                    opacity: 1
                  }
                }}
              >
                <Avatar
                  src={previewImage || '/images/default-avatar.png'}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '2px solid #86b817',
                    transition: 'opacity 0.3s'
                  }}
                />
                <Box
                  className="upload-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <UploadIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
              </Box>
            </label>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              label="Agency Name"
              name="name"
              margin="normal"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              sx={{ mb: 2 }}
              data-aos="fade-up"
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
              required
              sx={{ mb: 2 }}
              data-aos="fade-up"
              data-aos-delay="100"
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              margin="normal"
              variant="outlined"
              value={formData.phone_number}
              onChange={handleChange}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
              required
              sx={{ mb: 2 }}
              data-aos="fade-up"
              data-aos-delay="150"
            />

            <FormControl 
              fullWidth 
              margin="normal" 
              sx={{ mb: 2 }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="agency">Agency</MenuItem>
                <MenuItem value="club">Club</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
              sx={{ mb: 2 }}
              data-aos="fade-up"
              data-aos-delay="250"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              margin="normal"
              variant="outlined"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              required
              sx={{ mb: 2 }}
              data-aos="fade-up"
              data-aos-delay="300"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2, 
        bgcolor: 'grey.100',
        position: 'sticky',
        bottom: 0,
        zIndex: 1
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 3,
            mr: 2,
            '&:hover': {
              bgcolor: 'grey.200'
            }
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
            bgcolor: '#86b817',
            '&:hover': {
              bgcolor: '#7aa814',
              boxShadow: '0 4px 6px -1px rgba(134, 184, 23, 0.3)'
            }
          }}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Adding...' : 'Add Agency'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAgencyModal;