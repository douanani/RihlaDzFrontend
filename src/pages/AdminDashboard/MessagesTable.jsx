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
  Fade,
  Badge,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import MessageDetailsModal from "./MessageDetailsModal";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-quart",
      once: true,
    });
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/api/admin/messages");
      setMessages(response.data);
      setUnreadCount(
        response.data.filter((msg) => msg.status === "unread").length
      );
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm Deletion",
      text: "This will permanently delete the message.",
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
        container: "swal2-container",
        popup: "rounded-xl shadow-2xl",
      },
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/messages/${id}`);
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        setSelected(selected.filter((item) => item !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Message has been removed.",
          icon: "success",
          confirmButtonColor: "#86b817",
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete message.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        console.error("Delete failed", error);
      }
    }
  };
const handleBulkDelete = async () => {
  const confirm = await Swal.fire({
    title: `Delete ${selected.length} messages?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#86b817",
    cancelButtonColor: "#6c757d",
    confirmButtonText: `Delete (${selected.length})`,
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
      // Call the bulk delete API endpoint
      await api.post('/api/messages/delete-multiple', { ids: selected });
      
      // Update the UI by removing the deleted messages
      setMessages(prev => prev.filter(msg => !selected.includes(msg.id)));
      
      // Clear the selection
      setSelected([]);
      
      // Update unread count if any unread messages were deleted
      setUnreadCount(prev => {
        const deletedUnreadCount = messages.filter(
          msg => selected.includes(msg.id) && msg.status === 'unread'
        ).length;
        return prev - deletedUnreadCount;
      });

      Swal.fire({
        title: "Deleted!",
        text: `${selected.length} messages have been removed.`,
        icon: "success",
        confirmButtonColor: "#86b817",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete messages.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      console.error("Bulk delete failed", error);
    }
  }
};

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/messages/${id}/mark-read`);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: "read" } : msg))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
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
      const newSelected = filteredMessages.map((msg) => msg.id);
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

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.phone && msg.phone.includes(searchTerm)) ||
      (msg.subject &&
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMessages();
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
                Messages Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredMessages.length} total messages •{" "}
                <Badge
                  badgeContent={unreadCount}
                  color="primary"
                  sx={{ mr: 1 }}
                />{" "}
                unread
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
                placeholder="Search messages..."
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

              {selected.length > 0 ? (
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  sx={{
                    bgcolor: "#ef4444",
                    color: "white",
                    borderRadius: 2,
                    px: 3,
                    "&:hover": {
                      bgcolor: "#dc2626",
                      boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
                    },
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
                    "&:hover": {
                      borderColor: "#86b817",
                      color: "#86b817",
                      bgcolor: "rgba(134,184,23,0.05)",
                    },
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
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  padding="checkbox"
                  sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                >
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < filteredMessages.length
                    }
                    checked={
                      filteredMessages.length > 0 &&
                      selected.length === filteredMessages.length
                    }
                    onChange={handleSelectAllClick}
                    sx={{
                      color: "#86b817",
                      "&.Mui-checked": { color: "#86b817" },
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Sender
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Subject
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Message Preview
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#64748b",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Date
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
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src="/images/no-data.svg"
                        alt="No data"
                        style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No messages found
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
                <AnimatePresence>
                  {filteredMessages
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((message) => {
                      const isSelected = selected.indexOf(message.id) !== -1;
                      return (
                        <motion.tr
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{
                            backgroundColor: "rgba(134,184,23,0.03)",
                          }}
                        >
                          <TableCell
                            padding="checkbox"
                            sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) =>
                                handleClick(event, message.id)
                              }
                              sx={{
                                color: "#86b817",
                                "&.Mui-checked": { color: "#86b817" },
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box>
                                <Typography fontWeight="600" color="#1e293b">
                                  {message.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  <EmailIcon
                                    fontSize="small"
                                    sx={{ color: "#64748b", fontSize: 16 }}
                                  />
                                  <Typography variant="body2" color="#64748b">
                                    {message.email}
                                  </Typography>
                                </Box>
                                {message.phone && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      mt: 0.5,
                                    }}
                                  >
                                    <PhoneIcon
                                      fontSize="small"
                                      sx={{ color: "#64748b", fontSize: 16 }}
                                    />
                                    <Typography variant="body2" color="#64748b">
                                      {message.phone}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                          >
                            <Typography fontWeight="500">
                              {message.subject || "No subject"}
                            </Typography>
                            {message.status === "unread" && (
                              <Chip
                                label="New"
                                size="small"
                                sx={{
                                  bgcolor: "#86b817",
                                  color: "white",
                                  fontWeight: "600",
                                  fontSize: "0.65rem",
                                  height: 18,
                                  mt: 0.5,
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                color:
                                  message.status === "read"
                                    ? "#64748b"
                                    : "#1e293b",
                              }}
                            >
                              {message.message}
                            </Typography>
                          </TableCell>
                          <TableCell
                            sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <ScheduleIcon
                                fontSize="small"
                                sx={{ color: "#64748b", fontSize: 16 }}
                              />
                              <Typography variant="body2" color="#64748b">
                                {new Date(message.created_at).toLocaleString()}
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
                                  onClick={() => {
                                    if (!message.read)
                                      handleMarkAsRead(message.id);
                                    setSelectedMessage(message);
                                    setModalOpen(true);
                                  }}
                                  size="small"
                                  sx={{
                                    color: "#549af5",
                                    "&:hover": {
                                      bgcolor: "rgba(84,154,245,0.1)",
                                    },
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Delete"
                                arrow
                                TransitionComponent={Fade}
                              >
                                <IconButton
                                  onClick={() => handleDelete(message.id)}
                                  size="small"
                                  sx={{
                                    color: "#ef4444",
                                    "&:hover": {
                                      bgcolor: "rgba(239,68,68,0.1)",
                                    },
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                </AnimatePresence>
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
              {Math.min((page + 1) * rowsPerPage, filteredMessages.length)}
            </strong>{" "}
            of <strong>{filteredMessages.length}</strong> messages
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredMessages.length}
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
      <MessageDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={selectedMessage}
      />
    </Box>
  );
};

export default AdminMessages;
