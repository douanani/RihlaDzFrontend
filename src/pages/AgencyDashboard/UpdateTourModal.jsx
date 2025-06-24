import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  Stack,
  Grid,
  CircularProgress,
  InputAdornment,
  Paper
} from "@mui/material";
import { 
  Close, 
  Delete, 
  AddPhotoAlternate, 
  CloudUpload,
  CalendarToday,
  AttachMoney,
  LocationOn,
  AccessTime,
  Category
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import api from "../../api/axios";

const EditTourModal = ({ open, onClose, tour, onTourUpdated }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newImagesPreviews, setNewImagesPreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .min(0, "Price must be positive")
      .required("Price is required"),
    duration: Yup.number()
      .min(1, "Duration must be at least 1 day")
      .required("Duration is required"),
    location: Yup.string().required("Location is required"),
    category_id: Yup.string().required("Category is required"),
    status: Yup.string().required("Status is required"),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date()
      .min(Yup.ref('start_date'), "End date can't be before start date")
      .required("End date is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      duration: "",
      start_date: null,
      end_date: null,
      location: "",
      category_id: "",
      status: "unpublished",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        
        Object.keys(values).forEach(key => {
          if (values[key] !== null && values[key] !== undefined) {
            if (key.includes('_date') && values[key]) {
              formDataToSend.append(key, values[key].toISOString().split('T')[0]);
            } else {
              formDataToSend.append(key, values[key]);
            }
          }
        });
        
        if (thumbnail) {
          formDataToSend.append('thumbnail', thumbnail);
        }
        
        newImages.forEach(image => {
          formDataToSend.append('images[]', image);
        });
        
        deletedImages.forEach(id => {
          formDataToSend.append('deleted_images[]', id);
        });
        
        const response = await api.post(
          `/api/tours/${tour.id}?_method=PUT`, 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        onTourUpdated(response.data.tour);
        Swal.fire({
          title: 'Success!',
          text: 'Tour updated successfully',
          icon: 'success',
          confirmButtonColor: '#86b817',
        });
        onClose();
      } catch (error) {
        console.error("Error updating tour:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to update tour",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // Initialize form with tour data
  useEffect(() => {
    if (tour) {
      formik.setValues({
        title: tour.title || "",
        description: tour.description || "",
        price: tour.price || "",
        duration: tour.duration || "",
        start_date: tour.start_date ? new Date(tour.start_date) : null,
        end_date: tour.end_date ? new Date(tour.end_date) : null,
        location: tour.location || "",
        category_id: tour.category_id || "",
        status: tour.status || "unpublished",
      });
      
      if (tour.thumbnail) {
        setThumbnailPreview(`http://localhost:8000/storage/${tour.thumbnail}`);
      }
    }
  }, [tour]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data.categories || res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setNewImagesPreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = (imageId) => {
    setDeletedImages((prev) => [...prev, imageId]);
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="edit-tour-modal"
      aria-describedby="modal-to-edit-tour-details"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Paper
        sx={{
          width: { xs: '95vw', sm: '90vw', md: '850px' },
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '12px',
          boxShadow: 24,
          bgcolor: 'background.paper',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Edit Tour Details
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{
              color: "text.secondary",
              '&:hover': {
                color: "error.main",
                backgroundColor: 'action.hover',
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            {/* Basic Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}
              >
                <Category fontSize="small" />
                Basic Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tour Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    multiline
                    rows={4}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '8px' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Duration"
                    name="duration"
                    type="number"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                    helperText={formik.touched.duration && formik.errors.duration}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '8px' },
                      endAdornment: (
                        <InputAdornment position="end">days</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '8px' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl 
                    fullWidth 
                    size="medium" 
                    error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                    sx={{ borderRadius: '8px' }}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category_id"
                      value={formik.values.category_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Category"
                      variant="outlined"
                      sx={{ borderRadius: '8px' }}
                    >
                      <MenuItem value="">
                        <em>Select a category</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formik.touched.category_id && formik.errors.category_id}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl 
                    fullWidth 
                    size="medium" 
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    sx={{ borderRadius: '8px' }}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Status"
                      variant="outlined"
                      sx={{ borderRadius: '8px' }}
                    >
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="unpublished">Unpublished</MenuItem>
                    </Select>
                    <FormHelperText>
                      {formik.touched.status && formik.errors.status}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={formik.values.start_date}
                      onChange={(date) => formik.setFieldValue("start_date", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="medium"
                          error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                          helperText={formik.touched.start_date && formik.errors.start_date}
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '8px' }
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={formik.values.end_date}
                      onChange={(date) => formik.setFieldValue("end_date", date)}
                      minDate={formik.values.start_date}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="medium"
                          error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                          helperText={formik.touched.end_date && formik.errors.end_date}
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '8px' }
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Thumbnail Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}
              >
                <CloudUpload fontSize="small" />
                Thumbnail Image
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                <Box
                  sx={{
                    width: 200,
                    height: 150,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <CloudUpload sx={{ fontSize: 40, color: 'grey.400' }} />
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    size="medium"
                    sx={{
                      textTransform: 'none',
                      mb: 1,
                      borderRadius: '8px',
                      px: 3,
                      py: 1,
                      borderWidth: '1px',
                      '&:hover': {
                        borderWidth: '1px',
                      }
                    }}
                  >
                    {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Recommended size: 800x600px (JPEG, PNG)
                  </Typography>
                  {thumbnail && (
                    <Chip
                      label="New image selected"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Stack>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Gallery Images Section */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}
              >
                <AddPhotoAlternate fontSize="small" />
                Gallery Images
              </Typography>
              
              {/* Existing Images */}
              {tour?.images?.filter(img => !deletedImages.includes(img.id))?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Existing Images
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {tour.images
                      .filter(img => !deletedImages.includes(img.id))
                      .map((img) => (
                        <Grid item key={img.id} xs={6} sm={4} md={3}>
                          <Box sx={{ 
                            position: "relative",
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 3
                            }
                          }}>
                            <img
                              src={`${process.env.REACT_APP_API_URL}/storage/${img.image_path}`}
                              alt="Tour gallery"
                              style={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover'
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "background.paper",
                                color: 'error.main',
                                '&:hover': { 
                                  bgcolor: "error.light", 
                                  color: 'white' 
                                },
                              }}
                              onClick={() => handleDeleteImage(img.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                            <Box sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              p: 0.5,
                              textAlign: 'center'
                            }}>
                              <Typography variant="caption">Image #{img.id}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )}
              
              {/* New Images */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  New Images
                </Typography>
                
                <Grid container spacing={2}>
                  {newImagesPreviews.map((preview, index) => (
                    <Grid item key={index} xs={6} sm={4} md={3}>
                      <Box sx={{ 
                        position: "relative",
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3
                        }
                      }}>
                        <img
                          src={preview}
                          alt="New tour image"
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "background.paper",
                            color: 'error.main',
                            '&:hover': { 
                              bgcolor: "error.light", 
                              color: 'white' 
                            },
                          }}
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                        <Box sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          p: 0.5,
                          textAlign: 'center'
                        }}>
                          <Typography variant="caption">New Image</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                  
                  <Grid item xs={6} sm={4} md={3}>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        width: "100%",
                        height: 120,
                        borderRadius: '8px',
                        borderStyle: "dashed",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        transition: 'all 0.2s ease',
                        borderWidth: '1px',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'rgba(134, 184, 23, 0.05)',
                          borderWidth: '1px',
                        }
                      }}
                    >
                      <AddPhotoAlternate sx={{ fontSize: 32, color: 'grey.500' }} />
                      <Typography variant="caption" color="text.secondary">
                        Add Images
                      </Typography>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleNewImagesChange}
                      />
                    </Button>
                  </Grid>
                </Grid>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  You can upload multiple images at once (JPEG, PNG, WEBP)
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Footer Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                pt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  color: "text.secondary",
                  borderColor: "grey.300",
                  px: 4,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { 
                    borderColor: "grey.400",
                    bgcolor: 'grey.50'
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "primary.main",
                  px: 4,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { 
                    bgcolor: "primary.dark",
                    boxShadow: '0 4px 12px rgba(134, 184, 23, 0.3)'
                  },
                  minWidth: 150,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Tour"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default EditTourModal;