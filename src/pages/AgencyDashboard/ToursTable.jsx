import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Avatar,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  Button,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as PriceIcon,
  Schedule as DurationIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Public as PublishedIcon,
  VisibilityOff as UnpublishedIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import AddTourModal from "./AddTourModal";
import EditTourModal from "./UpdateTourModal";

const defaultThumbnail = "https://via.placeholder.com/150";

const MyToursTable = () => {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const fetchMyTours = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/my-tours");
      setTours(res.data.tours || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to fetch your tours",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-quart",
      once: true,
    });
    fetchMyTours();
  }, [fetchMyTours]);

  const handleAddTour = () => setAddModalOpen(true);

  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setEditModalOpen(true);
  };

  const handleTourAdded = useCallback((newTour) => {
    setTours((prevTours) => [newTour, ...prevTours]);
  }, []);

  const handleTourUpdated = useCallback((updatedTour) => {
    setTours((prevTours) =>
      prevTours.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour))
    );
  }, []);

  const handleDeleteTour = async (tourId) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#86b817",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Make API call to delete tour
        await api.delete(`/api/tours/${tourId}`);

        // Update local state
        setTours((prevTours) => prevTours.filter((tour) => tour.id !== tourId));

        // Show success message
        Swal.fire("Deleted!", "Your tour has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete tour",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleTourStatus = async (tourId, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "published" ? "unpublished" : "published";
      await api.patch(`/api/tours/${tourId}/status`, { status: newStatus });

      setTours((prevTours) =>
        prevTours.map((tour) =>
          tour.id === tourId ? { ...tour, status: newStatus } : tour
        )
      );

      Swal.fire({
        title: "Success!",
        text: `Tour has been ${newStatus}`,
        icon: "success",
        confirmButtonColor: "#86b817",
      });
    } catch (error) {
      console.error("Error updating tour status:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update tour status",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const filteredTours = tours.filter(
    (tour) =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <Box sx={{ p: { xs: 1, md: 3 } }} data-aos="fade-up">
        <Paper
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
            overflow: "hidden",
            background: "white",
          }}
        >
          <Box
            sx={{
              p: 3,
              background:
                "linear-gradient(135deg, rgba(134,184,23,0.1) 0%, rgba(84,154,245,0.1) 100%)",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="700" color="#2d3748">
                  My Tours
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredTours.length} tours in your agency
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: { xs: "100%", md: "auto" },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search tours..."
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
                      background: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#86b817",
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTour}
                  sx={{
                    bgcolor: "#86b817",
                    color: "white",
                    borderRadius: 2,
                    px: 3,
                    "&:hover": {
                      bgcolor: "#7aa814",
                    },
                  }}
                >
                  Add Tour
                </Button>
              </Box>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: "700", color: "#64748b" }}>
                    Tour
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#64748b" }}>
                    Details
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#64748b" }}>
                    Dates
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#64748b" }}>
                    Price & Duration
                  </TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#64748b" }}>
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "700",
                      color: "#64748b",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTours.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <img
                          src="/images/no-data.svg"
                          alt="No data"
                          style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          No tours found
                        </Typography>
                        <Button
                          variant="text"
                          sx={{ color: "#86b817", mt: 1 }}
                          onClick={() => setSearchTerm("")}
                        >
                          Clear search
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTours
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((tour) => (
                      <TableRow
                        key={tour.id}
                        hover
                        sx={{ "&:last-child td": { border: 0 } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={
                                `http://localhost:8000/storage/${tour.thumbnail}` ||
                                defaultThumbnail
                              }
                              alt={tour.title}
                              variant="rounded"
                              sx={{ width: 48, height: 48, bgcolor: "#549af5" }}
                            />
                            <Box>
                              <Typography fontWeight="600" color="#1e293b">
                                {tour.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="#64748b"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {tour.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LocationIcon fontSize="small" color="primary" />
                            <Typography variant="body2">
                              {tour.location}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Created: {formatDate(tour.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(tour.start_date)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(tour.end_date)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PriceIcon fontSize="small" color="success" />
                            <Typography fontWeight="600">
                              ${tour.price.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <DurationIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {tour.duration} days
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              tour.status === "published"
                                ? "Published"
                                : "Unpublished"
                            }
                            icon={
                              tour.status === "published" ? (
                                <PublishedIcon />
                              ) : (
                                <UnpublishedIcon />
                              )
                            }
                            color={
                              tour.status === "published"
                                ? "success"
                                : "default"
                            }
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              toggleTourStatus(tour.id, tour.status)
                            }
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor:
                                  tour.status === "published"
                                    ? "rgba(34, 197, 94, 0.08)"
                                    : "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="View" arrow>
                              <IconButton sx={{ color: "#3b82f6" }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                sx={{ color: "#86b817" }}
                                onClick={() => handleEditTour(tour)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                sx={{ color: "#ef4444" }}
                                onClick={() => handleDeleteTour(tour.id)}
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: "1px solid rgba(0,0,0,0.05)",
              bgcolor: "#f8fafc",
            }}
          >
            <Typography variant="body2" color="#64748b">
              Showing{" "}
              <strong>
                {page * rowsPerPage + 1}-
                {Math.min((page + 1) * rowsPerPage, filteredTours.length)}
              </strong>{" "}
              of <strong>{filteredTours.length}</strong> tours
            </Typography>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTours.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Paper>
      </Box>

      <AddTourModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onTourAdded={handleTourAdded}
      />

      <EditTourModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tour={selectedTour}
        onTourUpdated={handleTourUpdated}
      />
    </>
  );
};

export default MyToursTable;
