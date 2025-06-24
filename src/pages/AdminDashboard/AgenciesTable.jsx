import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Avatar,
  Chip,
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
  Fade,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import AddAgencyModal from "./AddAgencyModal";
import UpdateAgencyModal from "./UpdateAgencyModal";
import { useNavigate } from "react-router-dom";

const defaultLogo =
  "https://ui-avatars.com/api/?name=Agency&background=random&bold=true&color=fff";

const statusConfig = {
  approved: {
    color: "#16a34a",
    icon: <CheckCircleIcon fontSize="small" />,
    bgColor: "#f0fdf4",
  },
  pending: {
    color: "#d97706",
    icon: <PendingIcon fontSize="small" />,
    bgColor: "#fffbeb",
  },
  rejected: {
    color: "#dc2626",
    icon: <CancelIcon fontSize="small" />,
    bgColor: "#fef2f2",
  },
};

const typeConfig = {
  agency: {
    color: "#3b82f6",
    icon: <BusinessIcon fontSize="small" />,
    bgColor: "#eff6ff",
  },
  club: {
    color: "#8b5cf6",
    icon: <GroupsIcon fontSize="small" />,
    bgColor: "#f5f3ff",
  },
};

const AgenciesTable = () => {
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-quart",
      once: true,
    });
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await api.get("/api/admin/agencies");
      const { users, agencies: agencyInfos } = res.data;

      const combined = users.map((user) => {
        const agency = agencyInfos.find((a) => a.user_id === user.id);
        return {
          id: user.id,
          agencyId: agency?.id,
          name: user.name,
          email: user.email,
          phone: user.phone_number,
          logo: agency?.logo,
          status: agency?.status?.toLowerCase() || "pending",
          type: agency?.type?.toLowerCase() || "agency",
          agreementFile: agency?.verification_agreement, // Added agreement file
        };
      });
      setAgencies(combined);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

 const handleView = (userId) => {
  // Find the agency in our current data to get the agencyId
  const agency = agencies.find(a => a.id === userId);
  if (agency && agency.agencyId) {
    navigate(`/agency-profile/${agency.agencyId}`);
  } else {
    console.error("Agency ID not found for user:", userId);
    // Optionally show an error message to the user
    Swal.fire({
      title: "Error!",
      text: "Could not find agency details",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};
  const handleEdit = (agencyId) => {
    const agencyToEdit = agencies.find((agency) => agency.id === agencyId);
    console.log("Agency to edit:", agencyToEdit);

    if (agencyToEdit) {
      setSelectedAgency({
        ...agencyToEdit,
        user: {
          email: agencyToEdit.email,
          phone_number: agencyToEdit.phone,
          profile_photo_path: agencyToEdit.logo,
        },
      });
      setUpdateModalOpen(true);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Agency data not found",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDelete = async (agencyId) => {
    const agencyToDelete = agencies.find((agency) => agency.id === agencyId);
    if (!agencyToDelete) return;

    const result = await Swal.fire({
      title: "Delete Agency",
      text: `Are you sure you want to delete ${agencyToDelete.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(
          `/api/agencies/${agencyToDelete.agencyId || agencyId}`
        );

        Swal.fire(
          "Deleted!",
          "The agency and associated user have been deleted.",
          "success"
        );

        fetchAgencies();
      } catch (error) {
        console.error("Error deleting agency:", error);
        Swal.fire(
          "Error!",
          error.response?.data?.message ||
            "Failed to delete agency. Please try again.",
          "error"
        );
      }
    }
  };

  const handleApprove = async (agencyId, agencyName) => {
    const result = await Swal.fire({
      title: "Approve Agency",
      text: `Are you sure you want to approve ${agencyName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const agency = agencies.find((a) => a.id === agencyId);
        if (!agency) {
          throw new Error("Agency not found");
        }

        const response = await api.post(
          `/api/agencies/approve/${agency.agencyId}`
        );

        await Swal.fire(
          "Approved!",
          `${agencyName} has been approved successfully.`,
          "success"
        );

        fetchAgencies();
      } catch (error) {
        console.error("Error approving agency:", error);
        Swal.fire(
          "Error!",
          error.response?.data?.message ||
            "There was an error approving the agency.",
          "error"
        );
      }
    }
  };

  const handleReject = async (agencyId, agencyName) => {
    const result = await Swal.fire({
      title: "Reject Agency",
      text: `Are you sure you want to reject ${agencyName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const agency = agencies.find((a) => a.id === agencyId);
        if (!agency) {
          throw new Error("Agency not found");
        }

        const response = await api.post(
          `/api/agencies/reject/${agency.agencyId}`
        );

        await Swal.fire(
          "Rejected!",
          `${agencyName} has been rejected successfully.`,
          "success"
        );

        fetchAgencies();
      } catch (error) {
        console.error("Error rejecting agency:", error);
        Swal.fire(
          "Error!",
          error.response?.data?.message ||
            "There was an error rejecting the agency.",
          "error"
        );
      }
    }
  };

  const handleAddAgency = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddSuccess = () => {
    fetchAgencies();
  };

  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
    setSelectedAgency(null);
  };

  const handleUpdateSuccess = (updatedAgency) => {
    setAgencies(
      agencies.map((agency) =>
        agency.id === updatedAgency.id ? updatedAgency : agency
      )
    );
    setUpdateModalOpen(false);
  };

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agency.phone && agency.phone.includes(searchTerm))
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

  return (
    <>
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
                  Agencies & Clubs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredAgencies.length} registered organizations
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
                  placeholder="Search organizations..."
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

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddAgency}
                  sx={{
                    bgcolor: "#86b817",
                    color: "white",
                    borderRadius: 2,
                    px: 3,
                    "&:hover": {
                      bgcolor: "#7aa814",
                      boxShadow: "0 4px 12px rgba(134,184,23,0.3)",
                    },
                  }}
                >
                  Add Agency
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
                    Organization
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "700",
                      color: "#64748b",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "700",
                      color: "#64748b",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    Type
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
                    Agreement File
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "700",
                      color: "#64748b",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "700",
                      color: "#64748b",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      textAlign: "center",
                    }}
                  >
                    Manage
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAgencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <img
                          src="/images/no-data.svg"
                          alt="No data"
                          style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          No organizations found
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
                  filteredAgencies
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((agency) => (
                      <TableRow
                        key={agency.id}
                        hover
                        sx={{
                          "&:last-child td": { border: 0 },
                        }}
                      >
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
                            <Avatar
                              src={
                                `http://localhost:8000/storage/${agency.logo}` ||
                                defaultLogo
                              }
                              alt={agency.name}
                              variant="rounded"
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: "#549af5",
                                boxShadow: "0 2px 8px rgba(84,154,245,0.3)",
                              }}
                            />
                            <Box>
                              <Typography fontWeight="600" color="#1e293b">
                                {agency.name}
                              </Typography>
                              <Typography variant="body2" color="#64748b">
                                ID: {agency.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                        >
                          <Box>
                            <Typography fontWeight="500">
                              {agency.email}
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                              {agency.phone || "No phone number"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                        >
                          <Tooltip
                            title={
                              agency.type === "agency"
                                ? "Travel Agency"
                                : "Travel Club"
                            }
                            arrow
                            TransitionComponent={Fade}
                          >
                            <Chip
                              icon={typeConfig[agency.type]?.icon}
                              label={
                                agency.type.charAt(0).toUpperCase() +
                                agency.type.slice(1)
                              }
                              size="small"
                              sx={{
                                bgcolor: typeConfig[agency.type]?.bgColor,
                                color: typeConfig[agency.type]?.color,
                                fontWeight: "600",
                                px: 1,
                                "& .MuiChip-icon": {
                                  ml: 0.5,
                                  color: typeConfig[agency.type]?.color,
                                },
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                        >
                          <Tooltip
                            title={`Status: ${agency.status}`}
                            arrow
                            TransitionComponent={Fade}
                          >
                            <Chip
                              icon={statusConfig[agency.status]?.icon}
                              label={
                                agency.status.charAt(0).toUpperCase() +
                                agency.status.slice(1)
                              }
                              size="small"
                              sx={{
                                bgcolor: statusConfig[agency.status]?.bgColor,
                                color: statusConfig[agency.status]?.color,
                                fontWeight: "600",
                                px: 1,
                                "& .MuiChip-icon": {
                                  ml: 0.5,
                                  color: statusConfig[agency.status]?.color,
                                },
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
                        >
                          {agency.agreementFile ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PdfIcon />}
                              onClick={() =>
                                window.open(
                                  `http://localhost:8000/storage/${agency.agreementFile}`,
                                  "_blank"
                                )
                              }
                              sx={{
                                textTransform: "none",
                                color: "#3b82f6",
                                borderColor: "rgba(59, 130, 246, 0.5)",
                                "&:hover": {
                                  borderColor: "#3b82f6",
                                  backgroundColor: "rgba(59, 130, 246, 0.04)",
                                },
                              }}
                            >
                              View PDF
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No file
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                            textAlign: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Approve" arrow>
                              <IconButton
                                onClick={() =>
                                  handleApprove(agency.id, agency.name)
                                }
                                disabled={agency.status === "approved"}
                                sx={{
                                  color:
                                    agency.status === "approved"
                                      ? "#d1d5db"
                                      : "#16a34a",
                                  "&:hover": {
                                    bgcolor: "rgba(22, 163, 74, 0.1)",
                                    color: "#16a34a",
                                  },
                                }}
                              >
                                <ApproveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject" arrow>
                              <IconButton
                                onClick={() =>
                                  handleReject(agency.id, agency.name)
                                }
                                disabled={agency.status === "rejected"}
                                sx={{
                                  color:
                                    agency.status === "rejected"
                                      ? "#d1d5db"
                                      : "#dc2626",
                                  "&:hover": {
                                    bgcolor: "rgba(220, 38, 38, 0.1)",
                                    color: "#dc2626",
                                  },
                                }}
                              >
                                <RejectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                            textAlign: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="View" arrow>
                              <IconButton
                                onClick={() => handleView(agency.id)} // Passing user id here
                                sx={{
                                  color: "#3b82f6",
                                  "&:hover": {
                                    bgcolor: "rgba(59, 130, 246, 0.1)",
                                  },
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                onClick={() => handleEdit(agency.id)}
                                sx={{
                                  color: "#86b817",
                                  "&:hover": {
                                    bgcolor: "rgba(134, 184, 23, 0.1)",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                onClick={() => handleDelete(agency.id)}
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": {
                                    bgcolor: "rgba(239, 68, 68, 0.1)",
                                  },
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
                {Math.min((page + 1) * rowsPerPage, filteredAgencies.length)}
              </strong>{" "}
              of <strong>{filteredAgencies.length}</strong> organizations
            </Typography>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAgencies.length}
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

      {/* Add Agency Modal */}
      <AddAgencyModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleAddSuccess}
      />

      {/* Update Agency Modal */}
      <UpdateAgencyModal
        open={updateModalOpen}
        onClose={handleUpdateClose}
        onSuccess={handleUpdateSuccess}
        agency={selectedAgency}
      />
    </>
  );
};

export default AgenciesTable;
