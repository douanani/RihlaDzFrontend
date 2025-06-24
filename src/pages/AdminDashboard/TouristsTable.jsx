import React, { useEffect, useState } from "react";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  Checkbox,
  Button,
  Chip,
  Tooltip,
  Fade
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import api from "../../api/axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const defaultAvatar = "https://ui-avatars.com/api/?name=Tourist&background=random&color=fff";

const TouristsTable = () => {
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quart',
      once: true
    });
  }, []);

  const fetchTourists = async () => {
    try {
      const response = await api.get("/api/admin/tourists");
      setTourists(response.data);
    } catch (error) {
      console.error("Failed to fetch tourists", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm Deletion",
      text: "This will permanently delete the tourist account.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#86b817",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      backdrop: `
        rgba(0,0,0,0.5)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
      customClass: {
        container: 'swal2-container',
        popup: 'rounded-xl shadow-2xl'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`api/users/${id}`);
        setTourists((prev) => prev.filter((t) => t.id !== id));
        setSelected(selected.filter(item => item !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Tourist account has been removed.",
          icon: "success",
          confirmButtonColor: "#86b817",
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete tourist.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        console.error("Delete failed", error);
      }
    }
  };

  const handleBulkDelete = () => {
    Swal.fire({
      title: `Delete ${selected.length} tourists?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#86b817",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Delete (${selected.length})`,
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement bulk delete logic here
        setTourists(tourists.filter(t => !selected.includes(t.id)));
        setSelected([]);
        Swal.fire(
          'Deleted!',
          `${selected.length} tourists have been removed.`,
          'success'
        );
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTourists.map((tourist) => tourist.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const filteredTourists = tourists.filter((tourist) =>
    tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tourist.phone_number && tourist.phone_number.includes(searchTerm))
  );

  useEffect(() => {
    fetchTourists();
  }, []);

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

  return (
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
                Tourists Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredTourists.length} registered tourists
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
                placeholder="Search tourists..."
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
              
              {selected.length > 0 ? (
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  sx={{
                    bgcolor: '#ef4444',
                    color: 'white',
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: '#dc2626',
                      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
                    }
                  }}
                >
                  Delete ({selected.length})
                </Button>
              ) : (
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
              )}
            </Box>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredTourists.length}
                    checked={filteredTourists.length > 0 && selected.length === filteredTourists.length}
                    onChange={handleSelectAllClick}
                    sx={{ color: "#86b817", '&.Mui-checked': { color: "#86b817" } }}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Tourist</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Contact</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Status</TableCell>
                <TableCell align="right" sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTourists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <img 
                        src="/images/no-data.svg" 
                        alt="No data" 
                        style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No tourists found
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
                filteredTourists
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tourist) => {
                    const isSelected = selected.indexOf(tourist.id) !== -1;
                    return (
                      <TableRow 
                        key={tourist.id}
                        hover
                        selected={isSelected}
                        sx={{ 
                          '&:last-child td': { border: 0 },
                          '&.Mui-selected': { bgcolor: 'rgba(134,184,23,0.05)' },
                          '&.Mui-selected:hover': { bgcolor: 'rgba(134,184,23,0.08)' }
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => handleClick(event, tourist.id)}
                            sx={{ color: "#86b817", '&.Mui-checked': { color: "#86b817" } }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={`http://localhost:8000/storage/${tourist.profile_photo_path}` || defaultAvatar}
                              alt={tourist.name}
                              sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: '#549af5',
                                boxShadow: '0 2px 8px rgba(84,154,245,0.3)'
                              }}
                            />
                            <Box>
                              <Typography fontWeight="600" color="#1e293b">
                                {tourist.name}
                              </Typography>
                              <Typography variant="body2" color="#64748b">
                                ID: {tourist.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Box>
                            <Typography fontWeight="500">{tourist.email}</Typography>
                            <Typography variant="body2" color="#64748b">
                              {tourist.phone_number || 'No phone'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Chip
                            icon={<CheckCircleIcon style={{ color: '#16a34a', fontSize: 16 }} />}
                            label="Active"
                            size="small"
                            sx={{
                              bgcolor: '#f0fdf4',
                              color: '#16a34a',
                              fontWeight: '600',
                              px: 1,
                              '& .MuiChip-icon': { ml: 0.5 }
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="View Details" arrow TransitionComponent={Fade}>
                              <IconButton
                                onClick={() => {
                                  // Handle view details
                                }}
                                size="small"
                                sx={{
                                  color: '#549af5',
                                  '&:hover': {
                                    bgcolor: 'rgba(84,154,245,0.1)',
                                  }
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow TransitionComponent={Fade}>
                              <IconButton
                                onClick={() => handleDelete(tourist.id)}
                                size="small"
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': {
                                    bgcolor: 'rgba(239,68,68,0.1)',
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
            Showing <strong>{page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredTourists.length)}</strong> of <strong>{filteredTourists.length}</strong> tourists
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTourists.length}
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
  );
};

export default TouristsTable;