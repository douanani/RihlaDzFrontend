import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
  TablePagination,
  Button,
  Tooltip,
  Fade,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Paid as PaidIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Payment as PaymentIcon,
  MonetizationOn as MoneyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

const AgencyBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-quart",
      once: true,
    });

    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    api
      .get("/api/agency/bookings")
      .then((res) => {
        setBookings(res.data.bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings", err);
        setLoading(false);
        showErrorAlert("Failed to load bookings. Please try again later.");
      });
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.booking_id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  const updatePaymentStatus = (bookingId, isPaid, paidAt = new Date().toISOString()) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.booking_id === bookingId
          ? { ...booking, is_paid: isPaid, paid_at: paidAt }
          : booking
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonColor: "#86b817",
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonColor: "#dc2626",
    });
  };

  const showConfirmationDialog = (title, text, confirmButtonText) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#86b817",
      cancelButtonColor: "#dc2626",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancel",
    });
  };

  const handleConfirmBooking = async (bookingId) => {
    const result = await showConfirmationDialog(
      "Confirm Booking",
      "Are you sure you want to confirm this booking?",
      "Yes, confirm"
    );

    if (result.isConfirmed) {
      try {
        const response = await api.patch(`/api/bookings/${bookingId}/confirm`);
        updateBookingStatus(bookingId, "confirmed");
        showSuccessAlert(response.data.message || "Booking confirmed successfully");
      } catch (err) {
        console.error("Failed to confirm booking", err);
        showErrorAlert(
          err.response?.data?.message || "Failed to confirm booking"
        );
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const result = await showConfirmationDialog(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      "Yes, cancel"
    );

    if (result.isConfirmed) {
      try {
        const response = await api.patch(`/api/bookings/${bookingId}/reject`);
        updateBookingStatus(bookingId, "cancelled");
        showSuccessAlert(response.data.message || "Booking cancelled successfully");
      } catch (err) {
        console.error("Failed to cancel booking", err);
        showErrorAlert(err.response?.data?.message || "Failed to cancel booking");
      }
    }
  };

  const handleMarkAsPaid = async (bookingId) => {
    const result = await showConfirmationDialog(
      "Mark as Paid",
      "Are you sure you want to mark this booking as paid?",
      "Yes, mark as paid"
    );

    if (result.isConfirmed) {
      try {
        const response = await api.patch(
          `/api/bookings/${bookingId}/mark-as-paid`
        );
        updatePaymentStatus(bookingId, true);
        showSuccessAlert(response.data.message || "Booking marked as paid successfully");
      } catch (err) {
        console.error("Failed to mark booking as paid", err);
        showErrorAlert(
          err.response?.data?.message || "Failed to mark booking as paid"
        );
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-DZ", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.tourist_phone && booking.tourist_phone.includes(searchTerm)) ||
      (booking.tourist_email && booking.tourist_email.toLowerCase().includes(searchTerm.toLowerCase()))
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
    <Box sx={{ p: { xs: 1, md: 3 } }} data-aos="fade-up">
      <Paper
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          border: "none",
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* Header Section */}
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
                Agency Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredBookings.length} total bookings
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
                placeholder="Search bookings..."
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
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#86b817",
                      borderWidth: 1,
                    },
                  },
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
                  "&:hover": {
                    borderColor: "#86b817",
                    color: "#86b817",
                    bgcolor: "rgba(134,184,23,0.05)",
                  },
                }}
              >
                Filters
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <ReceiptIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    Booking Code
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Tour
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <PersonIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    Tourist
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <PhoneIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    Phone
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <EmailIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    Email
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <PeopleIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    People
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <MoneyIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    Total Price
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <CalendarIcon
                      sx={{ fontSize: 18, mr: 1, color: "#86b817" }}
                    />
                    Booking Date
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <PaidIcon sx={{ fontSize: 18, mr: 1, color: "#86b817" }} />
                    Payment
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src="/images/no-data.svg"
                        alt="No data"
                        style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No bookings found
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
                filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow
                      key={booking.booking_code}
                      hover
                      sx={{
                        "&:last-child td": { border: 0 },
                        "&:hover": { bgcolor: "rgba(134,184,23,0.03)" },
                      }}
                    >
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Typography fontWeight="600" color="#1e293b">
                          {booking.booking_code}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={`http://localhost:8000/storage/${booking.tour_thumbnail}`}
                            alt={booking.tour_title}
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#549af5",
                              boxShadow: "0 2px 8px rgba(84,154,245,0.3)",
                            }}
                          />
                          <Box>
                            <Typography fontWeight="500">
                              {booking.tour_title}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={`http://localhost:8000/storage/${booking.tourist_profile_image}`}
                            alt={booking.tourist_name}
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#549af5",
                              boxShadow: "0 2px 8px rgba(84,154,245,0.3)",
                            }}
                          />
                          <Box>
                            <Typography fontWeight="500">
                              {booking.tourist_name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Typography>{booking.tourist_phone || "-"}</Typography>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Typography>{booking.tourist_email || "-"}</Typography>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Typography fontWeight="600">
                          {booking.number_of_people}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Typography fontWeight="600" color="#16a34a">
                          {formatPrice(booking.total_amount)} DA
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Typography>{booking.booking_date}</Typography>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            bgcolor:
                              booking.status === "confirmed"
                                ? "#f0fdf4"
                                : booking.status === "cancelled"
                                ? "#fef2f2"
                                : "#fffbeb",
                            color:
                              booking.status === "confirmed"
                                ? "#16a34a"
                                : booking.status === "cancelled"
                                ? "#dc2626"
                                : "#d97706",
                            fontWeight: "600",
                            px: 1,
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {booking.is_paid ? (
                            <Chip
                              label="Paid"
                              size="small"
                              sx={{
                                bgcolor: "#f0fdf4",
                                color: "#16a34a",
                                fontWeight: "600",
                              }}
                            />
                          ) : (
                            <Chip
                              label="Pending"
                              size="small"
                              sx={{
                                bgcolor: "#fffbeb",
                                color: "#d97706",
                                fontWeight: "600",
                              }}
                            />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {booking.paid_at || "Not paid yet"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Tooltip
                            title="View Details"
                            arrow
                            TransitionComponent={Fade}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                color: "#549af5",
                                "&:hover": {
                                  bgcolor: "rgba(84,154,245,0.1)",
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Confirm Button */}
                          {booking.status !== "confirmed" && (
                            <Tooltip
                              title="Confirm Booking"
                              arrow
                              TransitionComponent={Fade}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleConfirmBooking(booking.booking_id)}
                                sx={{
                                  color: "#16a34a",
                                  "&:hover": {
                                    bgcolor: "rgba(22, 163, 74, 0.1)",
                                  },
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Cancel Button */}
                          {booking.status !== "cancelled" && (
                            <Tooltip
                              title="Cancel Booking"
                              arrow
                              TransitionComponent={Fade}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleCancelBooking(booking.booking_id)}
                                sx={{
                                  color: "#dc2626",
                                  "&:hover": {
                                    bgcolor: "rgba(220, 38, 38, 0.1)",
                                  },
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Mark as Paid Button */}
                          {!booking.is_paid && (
                            <Tooltip
                              title="Mark as Paid"
                              arrow
                              TransitionComponent={Fade}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleMarkAsPaid(booking.booking_id)}
                                sx={{
                                  color: "#d97706",
                                  "&:hover": {
                                    bgcolor: "rgba(217, 119, 6, 0.1)",
                                  },
                                }}
                              >
                                <PaymentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Section */}
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
              {Math.min((page + 1) * rowsPerPage, filteredBookings.length)}
            </strong>{" "}
            of <strong>{filteredBookings.length}</strong> bookings
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.875rem",
                  color: "#64748b",
                },
              "& .MuiSelect-select": {
                py: 0.5,
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AgencyBookingsTable;