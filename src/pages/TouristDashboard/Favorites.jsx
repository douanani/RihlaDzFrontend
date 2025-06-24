// 📁 pages/FavoritesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Badge,
  Button,
  Stack,
  Divider,
  useTheme,
  TablePagination,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Explore as ExploreIcon,
  Star,
  Place,
  AccessTime,
  AttachMoney,
} from "@mui/icons-material";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/api/favorites");
        setFavorites(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch favorites");
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (tourId, tourTitle) => {
    Swal.fire({
      title: "Remove from favorites?",
      text: `Are you sure you want to remove "${tourTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#86B817",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/favorites/${tourId}`);
          setFavorites(favorites.filter((fav) => fav.tour.id !== tourId));
          Swal.fire("Removed!", "Tour removed from favorites.", "success");
        } catch (err) {
          console.error("Error removing favorite:", err);
          Swal.fire("Error!", "Failed to remove favorite.", "error");
        }
      }
    });
  };

  // Pagination handlers
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
        minHeight="60vh"
        flexDirection="column"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <FavoriteIcon color="primary" fontSize="large" />
        </motion.div>
        <Typography variant="h6" mt={2}>
          Loading your favorites...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", my: 5, p: 3 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
        </Paper>
      </motion.div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: "center", padding: "40px 0" }}
      >
        <FavoriteIcon color="disabled" sx={{ fontSize: 80 }} />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          No favorites yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You haven't added any tours to your favorites list.
        </Typography>
        <Button
          component={Link}
          to="/tours"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ExploreIcon />}
          sx={{ mt: 3 }}
        >
          Browse Tours
        </Button>
      </motion.div>
    );
  }

  // Calculate paginated data
  const paginatedFavorites = favorites.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          My Favorite Tours
        </Typography>
        <Badge badgeContent={favorites.length} color="primary">
          <FavoriteIcon color="action" fontSize="large" />
        </Badge>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="favorites table">
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>TOUR</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                  CATEGORY
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                  LOCATION
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>PRICE</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>
                  DURATION
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="right">
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {paginatedFavorites.map((favorite, index) => (
                  <motion.tr
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{
                      backgroundColor: theme.palette.action.hover,
                      boxShadow: theme.shadows[1],
                    }}
                    style={{
                      position: "relative",
                      borderBottom:
                        index !== paginatedFavorites.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : "none",
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={`http://localhost:8000/storage/${favorite.tour.thumbnail}`}
                          alt={favorite.tour.title}
                          variant="rounded"
                          sx={{
                            width: 60,
                            height: 40,
                            borderRadius: 1,
                            boxShadow: theme.shadows[1],
                          }}
                        />
                        <Box>
                          <Typography fontWeight="medium">
                            {favorite.tour.title}
                          </Typography>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <Star color="warning" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {favorite.tour.rating || "New"}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={favorite.tour.category?.name || "Uncategorized"}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Place color="secondary" fontSize="small" />
                        <Typography variant="body2">
                          {favorite.tour.location}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography fontWeight="medium">
                          {favorite.tour.price} DA
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTime color="info" fontSize="small" />
                        <Typography>{favorite.tour.duration} days</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          component={Link}
                          to={`/tourDetails/${favorite.tour.id}`}
                          color="primary"
                          size="small"
                          sx={{
                            bgcolor: theme.palette.primary.light,
                            "&:hover": {
                              bgcolor: theme.palette.primary.main,
                              color: "white",
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleRemoveFavorite(
                              favorite.tour.id,
                              favorite.tour.title
                            )
                          }
                          color="error"
                          size="small"
                          sx={{
                            bgcolor: theme.palette.error.light,
                            "&:hover": {
                              bgcolor: theme.palette.error.main,
                              color: "white",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={favorites.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            "& .MuiTablePagination-toolbar": {
              paddingLeft: 2,
              paddingRight: 2,
              minHeight: "52px", // Reduced height
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap", // Prevent wrapping
              overflow: "hidden", // Hide overflow if needed
            },
            "& .MuiTablePagination-selectLabel": {
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              margin: 0, // Remove default margins
              whiteSpace: "nowrap", // Prevent text wrapping
            },
            "& .MuiTablePagination-displayedRows": {
              fontSize: "0.875rem",
              fontWeight: 500,
              margin: 0, // Remove default margins
              whiteSpace: "nowrap", // Prevent text wrapping
              minWidth: "100px", // Ensure consistent width
            },
            "& .MuiTablePagination-actions": {
              marginLeft: 1,
              display: "flex",
              "& .MuiIconButton-root": {
                padding: "6px",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
                margin: "0 4px", // Adjusted spacing
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                "&.Mui-disabled": {
                  borderColor: theme.palette.action.disabledBackground,
                },
              },
            },
            "& .MuiSelect-select": {
              padding: "6px 32px 6px 12px",
              borderRadius: "4px",
              border: `1px solid ${theme.palette.divider}`,
              margin: "0 8px", // Adjusted spacing
              fontSize: "0.875rem",
              "&:focus": {
                borderRadius: "4px",
              },
            },
            "& .MuiTablePagination-select": {
              margin: 0, // Remove default margins
            },
            "& .MuiInputBase-root": {
              marginRight: 0, // Remove default right margin
            },
          }}
        />
      </Paper>

      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedFavorites.length} of {favorites.length} favorite
          tours
        </Typography>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
