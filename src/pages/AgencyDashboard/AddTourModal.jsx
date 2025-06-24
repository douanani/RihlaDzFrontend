import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Divider,
  Chip,
  Paper,
  Stack,
  FormHelperText,
} from "@mui/material";
import {
  Close,
  CloudUpload,
  Delete,
  Public as PublishedIcon,
  VisibilityOff as UnpublishedIcon,
  AttachMoney,
  AccessTime,
  LocationOn,
  CalendarToday,
  Category as CategoryIcon,
  AddPhotoAlternate,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95vw", sm: "90vw", md: "850px" },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  overflowY: "auto",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(255, "Title is too long"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  duration: Yup.number()
    .required("Duration is required")
    .integer("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day"),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date().min(
    Yup.ref("start_date"),
    "End date cannot be before start date"
  ),
  location: Yup.string()
    .required("Location is required")
    .max(255, "Location is too long"),
  category_id: Yup.string().nullable(),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["published", "unpublished"], "Invalid status"),
});

const AddTourModal = ({ open, onClose, onTourAdded }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [newImagesPreviews, setNewImagesPreviews] = useState([]);

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
      status: "published",
      thumbnail: null,
      images: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formDataToSend = new FormData();

        Object.keys(values).forEach((key) => {
          if (values[key] !== null && values[key] !== undefined) {
            if (key.includes("_date") && values[key]) {
              formDataToSend.append(
                key,
                values[key].toISOString().split("T")[0]
              );
            } else if (key === "images") {
              values.images.forEach((image) => {
                formDataToSend.append("images[]", image);
              });
            } else {
              formDataToSend.append(key, values[key]);
            }
          }
        });

        const response = await api.post("/api/tours", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        onTourAdded(response.data.tour);
        Swal.fire({
          title: "Success!",
          text: "Tour created successfully",
          icon: "success",
          confirmButtonColor: "#86b817",
        });
        handleClose();
      } catch (error) {
        console.error("Error creating tour:", error);
        let errorMessage =
          error.response?.data?.message || "Failed to create tour";

        if (error.response?.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).join("\n");
        }

        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    },
  });

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
      formik.setFieldValue("thumbnail", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formik.values.images.length > 5) {
      Swal.fire({
        title: "Warning!",
        text: "You can upload a maximum of 5 images",
        icon: "warning",
        confirmButtonColor: "#86b817",
      });
      return;
    }

    const newImages = [...formik.values.images, ...files];
    formik.setFieldValue("images", newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagesPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...formik.values.images];
    newImages.splice(index, 1);
    formik.setFieldValue("images", newImages);

    const newPreviews = [...newImagesPreviews];
    newPreviews.splice(index, 1);
    setNewImagesPreviews(newPreviews);
  };

  const handleClose = () => {
    formik.resetForm();
    setThumbnailPreview(null);
    setNewImagesPreviews([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-tour-modal"
      aria-describedby="modal-to-add-new-tour"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <Paper
        sx={{
          ...modalStyle,
          "&:focus-visible": {
            outline: "none",
          },
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
            Add New Tour
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                backgroundColor: "action.hover",
              },
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                }}
              >
                <CategoryIcon fontSize="small" />
                Basic Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                      sx: { borderRadius: "8px" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    size="medium"
                    sx={{ borderRadius: "8px" }}
                  >
                    <InputLabel>Category (Optional)</InputLabel>
                    <Select
                      name="category_id"
                      value={formik.values.category_id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Category (Optional)"
                      variant="outlined"
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    variant="outlined"
                    size="medium"
                    multiline
                    rows={4}
                    InputProps={{
                      sx: { borderRadius: "8px" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.location && Boolean(formik.errors.location)
                    }
                    helperText={
                      formik.touched.location && formik.errors.location
                    }
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "8px" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
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
                      sx: { borderRadius: "8px" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Duration"
                    name="duration"
                    type="number"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.duration && Boolean(formik.errors.duration)
                    }
                    helperText={
                      formik.touched.duration && formik.errors.duration
                    }
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "8px" },
                      endAdornment: (
                        <InputAdornment position="end">days</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    size="medium"
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    sx={{ borderRadius: "8px" }}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Status"
                      variant="outlined"
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="published">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PublishedIcon fontSize="small" />
                          <span>Published</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="unpublished">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <UnpublishedIcon fontSize="small" />
                          <span>Unpublished</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                    <FormHelperText>
                      {formik.touched.status && formik.errors.status}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={formik.values.start_date}
                      onChange={(date) =>
                        formik.setFieldValue("start_date", date)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="medium"
                          error={
                            formik.touched.start_date &&
                            Boolean(formik.errors.start_date)
                          }
                          helperText={
                            formik.touched.start_date &&
                            formik.errors.start_date
                          }
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: "8px" },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={formik.values.end_date}
                      onChange={(date) =>
                        formik.setFieldValue("end_date", date)
                      }
                      minDate={formik.values.start_date}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="medium"
                          error={
                            formik.touched.end_date &&
                            Boolean(formik.errors.end_date)
                          }
                          helperText={
                            formik.touched.end_date && formik.errors.end_date
                          }
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: "8px" },
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                }}
              >
                <CloudUpload fontSize="small" />
                Thumbnail Image
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 200,
                    height: 150,
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px dashed",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.50",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <CloudUpload sx={{ fontSize: 40, color: "grey.400" }} />
                  )}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    size="medium"
                    sx={{
                      textTransform: "none",
                      mb: 1,
                      borderRadius: "8px",
                      px: 3,
                      py: 1,
                      borderWidth: "1px",
                      "&:hover": {
                        borderWidth: "1px",
                      },
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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Recommended size: 800x600px (JPEG, PNG)
                  </Typography>
                  {formik.touched.thumbnail && formik.errors.thumbnail && (
                    <Typography
                      color="error"
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {formik.errors.thumbnail}
                    </Typography>
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                }}
              >
                <AddPhotoAlternate fontSize="small" />
                Gallery Images (Max 5)
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternate />}
                  disabled={formik.values.images.length >= 5}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 3,
                    py: 1,
                    borderWidth: "1px",
                    "&:hover": {
                      borderWidth: "1px",
                    },
                  }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                  />
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 2 }}
                >
                  {formik.values.images.length} / 5 images selected
                </Typography>
                {formik.touched.images && formik.errors.images && (
                  <Typography
                    color="error"
                    variant="caption"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {formik.errors.images}
                  </Typography>
                )}
              </Box>

              <Grid container spacing={2}>
                {newImagesPreviews.map((preview, index) => (
                  <Grid item key={index} xs={6} sm={4} md={3}>
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: 1,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <img
                        src={preview}
                        alt="Tour image"
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "background.paper",
                          color: "error.main",
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "white",
                          },
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}

                {formik.values.images.length < 5 && (
                  <Grid item xs={6} sm={4} md={3}>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        width: "100%",
                        height: 120,
                        borderRadius: "8px",
                        borderStyle: "dashed",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        transition: "all 0.2s ease",
                        borderWidth: "1px",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "rgba(134, 184, 23, 0.05)",
                          borderWidth: "1px",
                        },
                      }}
                    >
                      <AddPhotoAlternate
                        sx={{ fontSize: 32, color: "grey.500" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Add Images
                      </Typography>
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleImagesChange}
                      />
                    </Button>
                  </Grid>
                )}
              </Grid>
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
                onClick={handleClose}
                disabled={loading}
                sx={{
                  color: "text.secondary",
                  borderColor: "grey.300",
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "grey.400",
                    bgcolor: "grey.50",
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
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: "0 4px 12px rgba(134, 184, 23, 0.3)",
                  },
                  minWidth: 150,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Tour"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddTourModal;
