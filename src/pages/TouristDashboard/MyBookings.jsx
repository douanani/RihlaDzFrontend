import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, Chip, 
  IconButton, Badge, Button, Stack, useTheme, TablePagination,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Rating
} from '@mui/material';
import { 
  Cancel as CancelIcon, 
  Visibility as VisibilityIcon,
  Event as EventIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  DoNotDisturb as CanceledIcon,
  RateReview as RateReviewIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../../api/axios';

const MyBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');

  // Track which tours have been reviewed
  const [hasReviewed, setHasReviewed] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

const fetchBookings = async () => {
  try {
    setLoading(true);
    const res = await api.get('/api/my-bookings');
    
    // Check if response data exists and has bookings array
    if (res.data && Array.isArray(res.data)) {
      setBookings(res.data);
      
      // Create a map of tour IDs to review status
      const reviewStatus = {};
      res.data.forEach(booking => {
        if (booking.tour_id) {
          reviewStatus[booking.tour_id] = booking.has_reviewed || false;
        }
      });
      setHasReviewed(reviewStatus);
    } else {
      setBookings([]);
      setHasReviewed({});
      setError("Invalid data format received from server");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch bookings");
    console.error(err);
    setBookings([]);
    setHasReviewed({});
  } finally {
    setLoading(false);
  }
};
  const cancelBooking = async (id, title) => {
    const confirm = await Swal.fire({
      title: 'Cancel booking?',
      text: `Are you sure you want to cancel "${title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#86B817',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    });

    if (confirm.isConfirmed) {
      try {
        await api.post(`/api/cancel-booking/${id}`);
        Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
        fetchBookings();
      } catch (err) {
        Swal.fire('Error!', 'Failed to cancel booking.', 'error');
      }
    }
  };

  const openReviewDialog = (booking) => {
    setCurrentBooking(booking);
    setReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
    setCurrentBooking(null);
    setRating(3);
    setComment('');
  };

  const submitReview = async () => {
    try {
      await api.post('/api/reviews', {
        tour_id: currentBooking.tour_id,
        rating: rating,
        comment: comment
      });

      Swal.fire({
        title: 'Success!',
        text: 'Your review has been submitted.',
        icon: 'success',
        confirmButtonColor: '#86B817'
      });

      // Update the hasReviewed state
      setHasReviewed(prev => ({
        ...prev,
        [currentBooking.tour_id]: true
      }));

      closeReviewDialog();
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to submit review',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
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
          <EventIcon color="primary" fontSize="large" />
        </motion.div>
        <Typography variant="h6" mt={2}>
          Loading your bookings...
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

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: "center", padding: "40px 0" }}
      >
        <EventIcon color="disabled" sx={{ fontSize: 80 }} />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          No bookings yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You haven't made any bookings yet.
        </Typography>
        <Button
          component={Link}
          to="/tours"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<VisibilityIcon />}
          sx={{ mt: 3 }}
        >
          Browse Tours
        </Button>
      </motion.div>
    );
  }

  // Calculate paginated data
  const paginatedBookings = bookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <PendingIcon color="warning" fontSize="small" />;
      case 'cancelled':
        return <CanceledIcon color="error" fontSize="small" />;
      default:
        return <PendingIcon color="info" fontSize="small" />;
    }
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          My Bookings
        </Typography>
        <Badge badgeContent={bookings.length} color="primary">
          <EventIcon color="action" fontSize="large" />
        </Badge>
      </Stack>

      <Paper elevation={0} sx={{ 
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
      }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="bookings table">
            <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>TOUR</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>AGENCY</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>PEOPLE</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>TOTAL</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>PAYMENT</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {paginatedBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                      backgroundColor: theme.palette.action.hover,
                      boxShadow: theme.shadows[1]
                    }}
                    style={{
                      position: 'relative',
                      borderBottom: index !== paginatedBookings.length - 1 ? `1px solid ${theme.palette.divider}` : 'none'
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={`http://localhost:8000/storage/${booking.tour?.thumbnail}`}
                          alt={booking.tour?.title}
                          variant="rounded"
                          sx={{ 
                            width: 60, 
                            height: 40,
                            borderRadius: 1,
                            boxShadow: theme.shadows[1]
                          }}
                        />
                        <Typography fontWeight="medium">
                          {booking.tour?.title || 'Deleted Tour'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography>
                        {booking.tour?.agency?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PeopleIcon color="primary" fontSize="small" />
                        <Typography>
                          {booking.number_of_people}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <MoneyIcon color="primary" fontSize="small" />
                        <Typography fontWeight="medium">
                          {booking.total_amount} DA
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Tooltip 
                        title={booking.is_paid ? 
                          `Paid on ${new Date(booking.paid_at).toLocaleString()}` : 
                          'Payment pending'}
                        arrow
                      >
                        <Chip
                          label={booking.is_paid ? 'Paid' : 'Unpaid'}
                          color={booking.is_paid ? 'success' : 'warning'}
                          size="small"
                          icon={booking.is_paid ? 
                            <CheckCircleIcon fontSize="small" /> : 
                            <PendingIcon fontSize="small" />
                          }
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {getStatusIcon(booking.status)}
                        <Chip
                          label={booking.status}
                          color={
                            booking.status === 'confirmed' ? 'success' : 
                            booking.status === 'pending' ? 'warning' : 'error'
                          }
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          component={Link}
                          to={`/tourDetails/${booking.tour?.id}`}
                          color="primary"
                          size="small"
                          sx={{ 
                            bgcolor: theme.palette.primary.light,
                            '&:hover': {
                              bgcolor: theme.palette.primary.main,
                              color: 'white'
                            }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>

                        {booking.is_paid && !hasReviewed[booking.tour_id] && (
                          <Tooltip title="Leave a review">
                            <IconButton
                              onClick={() => openReviewDialog(booking)}
                              color="secondary"
                              size="small"
                              sx={{ 
                                bgcolor: theme.palette.secondary.light,
                                '&:hover': {
                                  bgcolor: theme.palette.secondary.main,
                                  color: 'white'
                                }
                              }}
                            >
                              <RateReviewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {booking.is_paid && hasReviewed[booking.tour_id] && (
                          <Tooltip title="You've already reviewed this tour">
                            <span>
                              <IconButton
                                disabled
                                color="secondary"
                                size="small"
                                sx={{ 
                                  bgcolor: theme.palette.action.disabledBackground,
                                  cursor: 'not-allowed'
                                }}
                              >
                                <RateReviewIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                        <IconButton
                          onClick={() => cancelBooking(booking.id, booking.tour?.title)}
                          color="error"
                          size="small"
                          disabled={booking.status === 'cancelled'}
                          sx={{ 
                            bgcolor: booking.status === 'cancelled' ? 
                              theme.palette.action.disabledBackground : 
                              theme.palette.error.light,
                            '&:hover': {
                              bgcolor: booking.status === 'cancelled' ? 
                                theme.palette.action.disabledBackground : 
                                theme.palette.error.main,
                              color: 'white'
                            }
                          }}
                        >
                          <CancelIcon fontSize="small" />
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
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 2,
              paddingRight: 2,
              minHeight: '52px',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              overflow: 'hidden',
            },
            '& .MuiTablePagination-selectLabel': {
              fontSize: '0.875rem',
              color: theme.palette.text.secondary,
              margin: 0,
              whiteSpace: 'nowrap',
            },
            '& .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              fontWeight: 500,
              margin: 0,
              whiteSpace: 'nowrap',
              minWidth: '100px',
            },
            '& .MuiTablePagination-actions': {
              marginLeft: 1,
              display: 'flex',
              '& .MuiIconButton-root': {
                padding: '6px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                margin: '0 4px',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-disabled': {
                  borderColor: theme.palette.action.disabledBackground,
                },
              },
            },
            '& .MuiSelect-select': {
              padding: '6px 32px 6px 12px',
              borderRadius: '4px',
              border: `1px solid ${theme.palette.divider}`,
              margin: '0 8px',
              fontSize: '0.875rem',
              '&:focus': {
                borderRadius: '4px',
              },
            },
            '& .MuiTablePagination-select': {
              margin: 0,
            },
            '& .MuiInputBase-root': {
              marginRight: 0,
            },
          }}
        />
      </Paper>

      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedBookings.length} of {bookings.length} bookings
        </Typography>
      </Box>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={closeReviewDialog}>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          {currentBooking && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {currentBooking.tour?.title || 'This Tour'}
              </Typography>
              <Box mt={2} mb={3}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="tour-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  precision={1}
                  size="large"
                />
              </Box>
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label="Your Review (optional)"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={submitReview} color="primary" variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookingsTable;