import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Stack,
  Grid,
  IconButton,
  Tooltip,
  useTheme
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AgencyProfile = () => {
  const { agencyId } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const res = await api.get(`/api/agency/${agencyId}`);
        setAgency(res.data);
      } catch (err) {
        console.error("Error fetching agency:", err);
        setError("Failed to load agency data");
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [agencyId]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        data-aos="fade-in"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        data-aos="fade-in"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Agency
          </Typography>
          <Typography paragraph>{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!agency) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        data-aos="fade-in"
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Agency Not Found
          </Typography>
          <Typography paragraph>The requested agency could not be found.</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to Agencies
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} data-aos="fade-in">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 3,
          borderRadius: '8px',
          px: 3,
          py: 1,
          boxShadow: theme.shadows[1],
          '&:hover': {
            boxShadow: theme.shadows[3]
          }
        }}
        variant="outlined"
      >
        Back to Agencies
      </Button>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: "16px",
          background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`
        }}
        data-aos="zoom-in"
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-overlay': {
                  opacity: 1
                }
              }}
            >
              <Avatar
                src={agency.logo ? `http://localhost:8000/storage/${agency.logo}` : "https://ui-avatars.com/api/?name=Agency&background=random"}
                sx={{ 
                  width: 180, 
                  height: 180,
                  border: `4px solid ${theme.palette.primary.main}`,
                  boxShadow: theme.shadows[4]
                }}
                alt={agency.name}
              />
              <Box
                className="edit-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <EditIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              mb={3}
            >
              <Box>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  {agency.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  <Chip 
                    label={agency.type} 
                    color="primary" 
                    size="medium"
                    sx={{ 
                      fontWeight: 'bold',
                      px: 1,
                      borderRadius: '6px'
                    }}
                  />
                  <Chip 
                    label={agency.status} 
                    color={agency.status === "approved" ? "success" : agency.status === "pending" ? "warning" : "error"} 
                    size="medium"
                    sx={{ 
                      fontWeight: 'bold',
                      px: 1,
                      borderRadius: '6px',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Box>
              
              <Stack direction="row" spacing={1}>
                <Tooltip title="Edit Profile">
                  <IconButton 
                    color="primary" 
                    sx={{ 
                      backgroundColor: theme.palette.primary.light,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export as PDF">
                  <IconButton 
                    color="secondary" 
                    sx={{ 
                      backgroundColor: theme.palette.secondary.light,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.main,
                        color: 'white'
                      }
                    }}
                  >
                    <PdfIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            <Box mb={4}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                mb={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <InfoIcon color="primary" /> Description
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: '12px',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}
              >
                <Typography paragraph sx={{ mb: 0 }}>
                  {agency.description || "No description provided"}
                </Typography>
              </Paper>
            </Box>

            <Box mb={4}>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                mb={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <LocationIcon color="primary" /> Location
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: '12px',
                  borderLeft: `4px solid ${theme.palette.secondary.main}`
                }}
              >
                <Typography paragraph sx={{ mb: 0 }}>
                  {agency.location || "No location provided"}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            my: 4, 
            borderWidth: '1px',
            borderColor: theme.palette.divider,
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}, transparent)`,
            height: '2px'
          }} 
        />

        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            textAlign: 'center',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '2px'
            }
          }}
        >
          Contact Information
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3} data-aos="fade-up" data-aos-delay="100">
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <PersonIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Person
                </Typography>
              </Box>
              <Typography variant="body1">
                {agency.user?.name || "Not specified"}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} data-aos="fade-up" data-aos-delay="200">
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Email
                </Typography>
              </Box>
              <Typography variant="body1">
                {agency.user?.email || "Not specified"}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} data-aos="fade-up" data-aos-delay="300">
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Phone
                </Typography>
              </Box>
              <Typography variant="body1">
                {agency.user?.phone_number || "Not specified"}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3} data-aos="fade-up" data-aos-delay="400">
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Registration Date
                </Typography>
              </Box>
              <Typography variant="body1">
                {new Date(agency.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AgencyProfile;