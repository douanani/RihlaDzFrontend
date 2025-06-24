import { useEffect, useState } from "react";
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
  Badge
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Tour as TourIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  DoneAll as ResolveIcon,
  DoneAll as DoneAllIcon,
  Report as ReportIcon,
} from "@mui/icons-material";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";

const statusConfig = {
  pending: {
    color: "#d97706",
    icon: <PendingIcon fontSize="small" />,
    bgColor: "#fffbeb",
    label: "Pending"
  },
  reviewed: {
    color: "#16a34a",
    icon: <CheckCircleIcon fontSize="small" />,
    bgColor: "#f0fdf4",
    label: "Reviewed"
  },
  ignored: {
    color: "#64748b",
    icon: <CancelIcon fontSize="small" />,
    bgColor: "#f1f5f9",
    label: "Ignored"
  }
};

const targetConfig = {
  tour: {
    color: "#7c3aed",
    icon: <TourIcon fontSize="small" />,
    bgColor: "#f5f3ff",
    label: "Tour"
  },
  agency: {
    color: "#3b82f6",
    icon: <BusinessIcon fontSize="small" />,
    bgColor: "#eff6ff",
    label: "Agency"
  },
  user: {
    color: "#059669",
    icon: <PersonIcon fontSize="small" />,
    bgColor: "#ecfdf5",
    label: "User"
  }
};

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    ignored: 0
  });

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quart',
      once: true
    });
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/reports");
      setReports(res.data);
      
      // Calculate stats
      const counts = {
        pending: res.data.filter(r => r.status === 'pending').length,
        reviewed: res.data.filter(r => r.status === 'reviewed').length,
        ignored: res.data.filter(r => r.status === 'ignored').length
      };
      setStats(counts);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to load reports. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    fetchReports();
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    const statusText = newStatus === 'ignored' ? 'ignore' : newStatus;
    const result = await Swal.fire({
      title: `Mark as ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
      text: `Are you sure you want to mark this report as ${statusText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'reviewed' ? '#16a34a' : newStatus === 'ignored' ? '#64748b' : '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, mark as ${statusText}!`,
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/api/reports/${reportId}/status`, { status: newStatus });
        Swal.fire(
          'Updated!',
          `The report has been marked as ${statusText}.`,
          'success'
        );
        fetchReports();
      } catch (error) {
        console.error("Error updating report status:", error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || `Failed to update report status to ${statusText}.`,
          'error'
        );
      }
    }
  };

  const handleViewDetails = (report) => {
    Swal.fire({
      title: 'Report Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Reporter:</strong> ${report.user ? `${report.user.name} (${report.user.email})` : 'Guest'}</p>
          <p><strong>Target:</strong> ${getTargetDisplay(report)}</p>
          <p><strong>Reason:</strong> ${report.reason || 'Not specified'}</p>
          <p><strong>Status:</strong> ${statusConfig[report.status]?.label || report.status}</p>
          <p><strong>Date:</strong> ${new Date(report.created_at).toLocaleString()}</p>
          <hr style="margin: 1rem 0; border-color: #eee;">
          <p><strong>Description:</strong></p>
          <div style="background: #f8f9fa; padding: 0.75rem; border-radius: 4px;">
            ${report.description || 'No additional details provided'}
          </div>
        </div>
      `,
      confirmButtonColor: '#86b817',
      width: '600px'
    });
  };

  const getTargetDisplay = (report) => {
    if (report.target_type === "tour") {
      return `Tour: ${report.tour?.title || 'Unknown Tour'}`;
    }
    if (report.target_type === "agency") {
      return `Agency: ${report.agency?.name || 'Unknown Agency'}`;
    }
    if (report.target_type === "user") {
      return `User: ${report.target_user?.name || 'Unknown User'} (${report.target_user?.email || 'No email'})`;
    }
    return "Other";
  };

  const filteredReports = reports.filter((report) =>
    (report.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.agency?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchTerm.toLowerCase()))
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
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(59,130,246,0.1) 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 2
          }}>
            <Box>
              <Typography variant="h5" fontWeight="700" color="#2d3748">
                Incoming Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredReports.length} total reports submitted
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
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
              Refresh
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Paper 
              sx={{ 
                p: 2, 
                flex: 1, 
                minWidth: 120,
                borderRadius: 2,
                bgcolor: statusConfig.pending.bgColor,
                borderLeft: `4px solid ${statusConfig.pending.color}`
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
              <Typography variant="h5" fontWeight="700" color={statusConfig.pending.color}>
                {stats.pending}
              </Typography>
            </Paper>

            <Paper 
              sx={{ 
                p: 2, 
                flex: 1, 
                minWidth: 120,
                borderRadius: 2,
                bgcolor: statusConfig.reviewed.bgColor,
                borderLeft: `4px solid ${statusConfig.reviewed.color}`
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Reviewed
              </Typography>
              <Typography variant="h5" fontWeight="700" color={statusConfig.reviewed.color}>
                {stats.reviewed}
              </Typography>
            </Paper>

            <Paper 
              sx={{ 
                p: 2, 
                flex: 1, 
                minWidth: 120,
                borderRadius: 2,
                bgcolor: statusConfig.ignored.bgColor,
                borderLeft: `4px solid ${statusConfig.ignored.color}`
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Ignored
              </Typography>
              <Typography variant="h5" fontWeight="700" color={statusConfig.ignored.color}>
                {stats.ignored}
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search reports..."
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
                }}>Reporter</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Target</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Reason</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Status</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>Date</TableCell>
                <TableCell sx={{ 
                  fontWeight: "700", 
                  color: "#64748b",
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  textAlign: 'right'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <img 
                        src="/images/no-data.svg" 
                        alt="No data" 
                        style={{ height: 120, opacity: 0.6, marginBottom: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No reports found
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
                filteredReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((report) => (
                    <TableRow 
                      key={report.id}
                      hover
                      sx={{ 
                        '&:last-child td': { border: 0 },
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={`http://localhost:8000/storage/${report.user?.profile_photo_path}` || `https://ui-avatars.com/api/?name=${report.user?.name || 'R'}&background=random`}
                            alt={report.user?.name || 'Reporter'}
                            sx={{ 
                              width: 40, 
                              height: 40,
                              bgcolor: '#ef4444'
                            }}
                          />
                          <Box>
                            <Typography fontWeight="600">
                              {report.user?.name || 'Guest'}
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                              {report.user?.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title={targetConfig[report.target_type]?.label || 'Other'} arrow>
                            <Box sx={{ 
                              display: 'inline-flex', 
                              p: 0.5,
                              bgcolor: targetConfig[report.target_type]?.bgColor || '#f3f4f6',
                              borderRadius: 1
                            }}>
                              {targetConfig[report.target_type]?.icon || <ReportIcon fontSize="small" />}
                            </Box>
                          </Tooltip>
                          <Typography>
                            {getTargetDisplay(report)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <Typography noWrap sx={{ maxWidth: 200 }}>
                          {report.reason || 'Not specified'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <Tooltip 
                          title={`Status: ${statusConfig[report.status]?.label || report.status}`} 
                          arrow 
                          TransitionComponent={Fade}
                        >
                          <Chip
                            icon={statusConfig[report.status]?.icon}
                            label={statusConfig[report.status]?.label || report.status}
                            size="small"
                            sx={{
                              bgcolor: statusConfig[report.status]?.bgColor,
                              color: statusConfig[report.status]?.color,
                              fontWeight: '600',
                              px: 1,
                              '& .MuiChip-icon': { 
                                ml: 0.5,
                                color: statusConfig[report.status]?.color
                              }
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <Typography variant="body2">
                          {new Date(report.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                          {new Date(report.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              onClick={() => handleViewDetails(report)}
                              sx={{ 
                                color: '#3b82f6',
                                '&:hover': { 
                                  bgcolor: 'rgba(59, 130, 246, 0.1)' 
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {report.status !== 'reviewed' && (
                            <Tooltip title="Mark as Reviewed" arrow>
                              <IconButton
                                onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                                sx={{ 
                                  color: '#16a34a',
                                  '&:hover': { 
                                    bgcolor: 'rgba(22, 163, 74, 0.1)' 
                                  }
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {report.status !== 'ignored' && (
                            <Tooltip title="Ignore Report" arrow>
                              <IconButton
                                onClick={() => handleUpdateStatus(report.id, 'ignored')}
                                sx={{ 
                                  color: '#64748b',
                                  '&:hover': { 
                                    bgcolor: 'rgba(100, 116, 139, 0.1)' 
                                  }
                                }}
                              >
                                <CancelIcon fontSize="small" />
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid rgba(0,0,0,0.05)',
          bgcolor: '#f8fafc'
        }}>
          <Typography variant="body2" color="#64748b">
            Showing <strong>{page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredReports.length)}</strong> of <strong>{filteredReports.length}</strong> reports
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredReports.length}
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

export default AdminReports;