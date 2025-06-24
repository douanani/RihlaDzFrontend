import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  InputAdornment,
  TablePagination,
  Fade,
  Avatar
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Category as CategoryIcon
} from "@mui/icons-material";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";

const statusConfig = {
  active: {
    color: "#16a34a",
    icon: <CheckCircleIcon fontSize="small" />,
    bgColor: "#f0fdf4"
  },
  inactive: {
    color: "#dc2626",
    icon: <CloseIcon fontSize="small" />,
    bgColor: "#fef2f2"
  }
};

const defaultIcon = "https://ui-avatars.com/api/?name=Category&background=random&bold=true&color=fff";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quart',
      once: true
    });
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/categories");
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showSnackbar("Failed to fetch categories", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/categories/${editingId}`, formData);
        showSnackbar("Category updated successfully");
      } else {
        await api.post("/api/categories", formData);
        showSnackbar("Category created successfully");
      }
      fetchCategories();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      showSnackbar(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      comment: category.comment || "",
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    const result = await Swal.fire({
      title: 'Delete Category',
      text: `Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/categories/${id}`);
        showSnackbar("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        showSnackbar("Failed to delete category", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      comment: "",
    });
    setEditingId(null);
  };

  const openNewCategoryModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.comment && category.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="300px"
        data-aos="fade-in"
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#86b817" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ p: { xs: 1, md: 3 } }} data-aos="fade-up">
        <Paper 
          sx={{ 
            borderRadius: 4,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
            border: 'none',
            overflow: 'hidden',
            background: 'white',
          }}
        >
          {/* Header Section */}
          <Box 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, rgba(134,184,23,0.1) 0%, rgba(84,154,245,0.1) 100%)',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2
            }}>
              <Box>
                <Typography variant="h5" fontWeight="700" color="#2d3748">
                  Categories Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredCategories.length} registered categories
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                width: { xs: '100%', md: 'auto' },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#86b817" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      background: 'white',
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.1)"
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#86b817"
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#86b817",
                        borderWidth: 1
                      }
                    }
                  }}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  sx={{
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "text.secondary",
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      borderColor: "#86b817",
                      color: "#86b817",
                      bgcolor: 'rgba(134,184,23,0.05)'
                    }
                  }}
                >
                  Filters
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openNewCategoryModal}
                  sx={{
                    bgcolor: "#86b817",
                    color: "white",
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: "#7aa814",
                      boxShadow: '0 4px 12px rgba(134,184,23,0.3)'
                    }
                  }}
                >
                  Add Category
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Table Section */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ 
                    fontWeight: "700", 
                    color: "#64748b",
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}>Category</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "700", 
                    color: "#64748b",
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}>Description</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "700", 
                    color: "#64748b",
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}>Status</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "700", 
                    color: "#64748b",
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    textAlign: 'center'
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <img 
                          src="/images/no-data.svg" 
                          alt="No data" 
                          style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          No categories found
                        </Typography>
                        <Button 
                          variant="text" 
                          sx={{ color: "#86b817", mt: 1 }}
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => (
                      <TableRow 
                        key={category.id}
                        hover
                        sx={{ 
                          '&:last-child td': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={defaultIcon}
                              alt={category.name}
                              variant="rounded"
                              sx={{ 
                                width: 48, 
                                height: 48,
                                bgcolor: '#8b5cf6',
                                boxShadow: '0 2px 8px rgba(139,92,246,0.3)'
                              }}
                            >
                              <CategoryIcon />
                            </Avatar>
                            <Box>
                              <Typography fontWeight="600" color="#1e293b">
                                {category.name}
                              </Typography>
                              <Typography variant="body2" color="#64748b">
                                ID: {category.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Typography color="#64748b">
                            {category.comment || 'No description'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Tooltip 
                            title={`Status: ${category.status || 'active'}`} 
                            arrow 
                            TransitionComponent={Fade}
                          >
                            <Chip
                              icon={statusConfig[category.status || 'active']?.icon}
                              label={(category.status || 'active').charAt(0).toUpperCase() + (category.status || 'active').slice(1)}
                              size="small"
                              sx={{
                                bgcolor: statusConfig[category.status || 'active']?.bgColor,
                                color: statusConfig[category.status || 'active']?.color,
                                fontWeight: '600',
                                px: 1,
                                '& .MuiChip-icon': { 
                                  ml: 0.5,
                                  color: statusConfig[category.status || 'active']?.color
                                }
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                onClick={() => handleEdit(category)}
                                sx={{ 
                                  color: '#86b817',
                                  '&:hover': { 
                                    bgcolor: 'rgba(134, 184, 23, 0.1)' 
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                onClick={() => handleDelete(category.id)}
                                sx={{ 
                                  color: '#ef4444',
                                  '&:hover': { 
                                    bgcolor: 'rgba(239, 68, 68, 0.1)' 
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid rgba(0,0,0,0.05)',
            bgcolor: '#f8fafc'
          }}>
            <Typography variant="body2" color="#64748b">
              Showing <strong>{page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredCategories.length)}</strong> of <strong>{filteredCategories.length}</strong> categories
            </Typography>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCategories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '0.875rem',
                  color: '#64748b'
                },
                '& .MuiSelect-select': {
                  py: 0.5
                }
              }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Add/Edit Category Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Edit Category" : "Add New Category"}
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="comment"
              label="Description"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={4}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={editingId ? <EditIcon /> : <AddIcon />}
            sx={{ borderRadius: 2, bgcolor: "#86b817", '&:hover': { bgcolor: "#7aa814" } }}
          >
            {editingId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryTable;