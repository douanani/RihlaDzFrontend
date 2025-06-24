import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
  Divider,
  ListItemIcon,
  styled,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import NotificationPanel from "./NotificationPanel/NotificationPanel";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color:
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black,
  margin: "0 8px",
  padding: "8px 12px",
  borderRadius: "4px",
  transition: "all 0.3s ease",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.active": {
    color: theme.palette.primary.main,
    fontWeight: 600,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

function Header({ mode, toggleColorMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSettingsClick = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorElSettings(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const updateUnreadCount = (count) => {
    setUnreadCount(count);
  };

  const handleLogout = () => {
    logout();
    handleSettingsClose();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: mode === "dark" ? "background.default" : "background.paper",
        borderBottom: `1px solid ${mode === "dark" ? theme.palette.divider : theme.palette.grey[200]}`,
        py: 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "xl",
          mx: "auto",
          width: "100%",
          minHeight: "64px !important",
          height: 64,
        }}
      >
        {/* Logo/Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: { xs: 56, sm: 64 },
            mr: { xs: 2, sm: 5 },
          }}
        >
          // Replace the current logo section with this:
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              height: "100%",
              alignItems: "center",
            }}
          >
            <img
              src={
                mode === "dark"
                  ? "/assets/img/logo-dark.png"
                  : "/assets/img/logo-light.png"
              }
              alt="RihlaDz Logo"
              style={{
                height: "100%",
                width: "auto",
                maxWidth: 200,
                objectFit: "contain",
              }}
            />
          </Link>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <StyledNavLink to="/">HOME</StyledNavLink>

            {user?.role === "agency" && (
              <StyledNavLink to="/agency-dashboard">DASHBOARD</StyledNavLink>
            )}
            {user?.role === "admin" && (
              <StyledNavLink to="/admin-dashboard">
                ADMIN DASHBOARD
              </StyledNavLink>
            )}
            {user?.role === "tourist" && (
              <StyledNavLink to="/my-dashboard">MY DASHBOARD</StyledNavLink>
            )}

            <StyledNavLink to="/Tours">TOURS</StyledNavLink>
            <StyledNavLink to="/Services">SERVICES</StyledNavLink>
            <StyledNavLink to="/Contact">CONTACT US</StyledNavLink>
            <StyledNavLink to="/About">ABOUT US</StyledNavLink>
          </Box>
        )}

        {/* Right-side actions */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Dark/Light mode toggle */}
          <IconButton
            onClick={toggleColorMode}
            sx={{
              mr: 1,
              color: mode === "dark" ? "common.white" : "common.black",
            }}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                mr: 1,
                color: mode === "dark" ? "common.white" : "common.black",
              }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Notifications - only shown when user is logged in */}
          {user && (
            <>
              <IconButton
                onClick={handleNotificationClick}
                sx={{
                  mr: 1,
                  color: mode === "dark" ? "common.white" : "common.black",
                }}
                aria-label="Notifications"
              >
                <StyledBadge badgeContent={unreadCount} color="error" max={9}>
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>

              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    width: 360,
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    overflow: "auto",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
              >
                <NotificationPanel
                  onClose={handleNotificationClose}
                  updateUnreadCount={updateUnreadCount}
                />
              </Menu>
            </>
          )}

          {/* User avatar and menu - only shown when user is logged in */}
          {user ? (
            <>
              <IconButton
                onClick={handleSettingsClick}
                sx={{ p: 0, ml: 1 }}
                aria-label="User settings"
              >
                <Avatar
                  alt={user?.name || "User"}
                  src={
                    user?.profile_photo_path
                      ? `http://localhost:8000/storage/${user.profile_photo_path}`
                      : `http://localhost:8000/storage/images/default_PP.jpg`
                  }
                  sx={{
                    width: 40,
                    height: 40,
                    border: `2px solid ${theme.palette.primary.main}`,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorElSettings}
                open={Boolean(anchorElSettings)}
                onClose={handleSettingsClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    width: 220,
                    overflow: "visible",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
              >
                <MenuItem disabled>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleSettingsClose();
                    navigate("/account-settings");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleSettingsClose();
                    navigate("/account-settings");
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            !isMobile && (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="primary"
                sx={{
                  ml: 2,
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                }}
              >
                Sign In
              </Button>
            )
          )}
        </Box>

        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              bgcolor:
                mode === "dark" ? "background.default" : "background.paper",
              zIndex: 10,
              boxShadow: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StyledNavLink to="/">HOME</StyledNavLink>

            {user?.role === "agency" && (
              <StyledNavLink to="/agency-dashboard">DASHBOARD</StyledNavLink>
            )}
            {user?.role === "admin" && (
              <StyledNavLink to="/admin-dashboard">
                ADMIN DASHBOARD
              </StyledNavLink>
            )}
            {user?.role === "tourist" && (
              <StyledNavLink to="/my-dashboard">MY DASHBOARD</StyledNavLink>
            )}

            <StyledNavLink to="/Tours">TOURS</StyledNavLink>
            <StyledNavLink to="/Services">SERVICES</StyledNavLink>
            <StyledNavLink to="/Contact">CONTACT US</StyledNavLink>
            <StyledNavLink to="/About">ABOUT US</StyledNavLink>

            {!user && (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: "20px",
                  textTransform: "none",
                  py: 1.5,
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
