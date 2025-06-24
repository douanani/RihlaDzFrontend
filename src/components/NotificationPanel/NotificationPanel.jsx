import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Box,
  Button,
  IconButton,
  List,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Tooltip,
  useTheme,
  Stack,
  Divider
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  MoreHoriz as MoreHorizIcon,
  Delete as DeleteIcon,
  Favorite as LikeIcon,
  ChatBubbleOutline as CommentIcon,
  PersonAdd as FollowIcon,
  Share as ShareIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Helper component to render notification content based on structure
const NotificationContent = ({ notification }) => {
  const theme = useTheme();
  
  // Handle different message structures
  const renderMessage = () => {
    // If message is directly provided
    if (notification.data?.message) {
      return notification.data.message;
    }
    
    // If we need to construct a message based on type
    const sender = notification.data?.name || "Someone";
    const target = notification.data?.target || "your post";
    
    switch(notification.type) {
      case 'Like':
        return `${sender} liked ${target}`;
      case 'Comment':
        return `${sender} commented on ${target}`;
      case 'Follow':
        return `${sender} started following you`;
      case 'Share':
        return `${sender} shared ${target}`;
      default:
        return "New notification";
    }
  };

  return (
    <>
      <Typography
        component="span"
        variant="body2"
        color="text.primary"
        display="block"
        sx={{ mb: 0.5 }}
      >
        {renderMessage()}
      </Typography>
      {notification.data?.preview && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ 
            fontSize: '0.75rem',
            fontStyle: 'italic',
            mt: 0.5
          }}
        >
          {notification.data.preview}
        </Typography>
      )}
    </>
  );
};

const NotificationItem = ({ notification, markAsRead }) => {
  const theme = useTheme();

  // Determine icon based on notification type
  const getNotificationIcon = () => {
    if (notification.type.includes('Like')) return <LikeIcon fontSize="small" />;
    if (notification.type.includes('Comment')) return <CommentIcon fontSize="small" />;
    if (notification.type.includes('Follow')) return <FollowIcon fontSize="small" />;
    return <ShareIcon fontSize="small" />;
  };

  // Handle different avatar sources
  const getAvatarSrc = () => {
    if (notification.data?.image) {
      // Handle both full URLs and local paths
      if (notification.data.image.startsWith('http')) {
        return notification.data.image;
      }
      return `http://localhost:8000/storage/${notification.data.image}`;
    }
    return "/static/images/avatar/1.jpg";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
      whileHover={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}
    >
      <ListItem
        alignItems="flex-start"
        sx={{
          cursor: "pointer",
          py: 1.5,
          px: 2,
          backgroundColor: notification.read_at 
            ? 'transparent' 
            : theme.palette.mode === 'dark' 
              ? 'rgba(0, 149, 246, 0.08)' 
              : 'rgba(0, 149, 246, 0.05)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.03)'
          }
        }}
      >
        <ListItemAvatar sx={{ minWidth: 48, position: 'relative' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color="primary"
            invisible={notification.read_at}
            sx={{
              '& .MuiBadge-badge': {
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: `2px solid ${theme.palette.background.paper}`
              }
            }}
          >
            <Avatar
              src={getAvatarSrc()}
              alt={notification.data?.name || "User"}
              sx={{ 
                width: 44, 
                height: 44,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Badge>
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.primary.main
          }}>
            {getNotificationIcon()}
          </Box>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                fontWeight={600}
                sx={{ flexGrow: 1 }}
              >
                {notification.data?.name || "User"}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Stack>
          }
          secondary={<NotificationContent notification={notification} />}
          sx={{ my: 0, ml: 1 }}
        />
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ml: 0.5
        }}>
          {!notification.read_at && (
            <Tooltip title="Mark as read" arrow>
              <IconButton
                size="small"
                aria-label="mark as read"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(notification.id);
                }}
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.primary.dark
                  }
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton 
            size="small" 
            sx={{ 
              color: 'text.disabled',
              '&:hover': {
                backgroundColor: 'transparent',
                color: theme.palette.text.primary
              }
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </ListItem>
      <Divider sx={{ mx: 2, my: 0 }} />
    </motion.div>
  );
};

const NotificationPanel = ({ onClose, updateUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data.notifications || []);
      const count = res.data.unread_count || 0;
      setUnreadCount(count);
      if (updateUnreadCount) {
        updateUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications. Please try again.");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/api/notifications/read-all");
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setError("Failed to mark notifications as read");
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.post("/api/notifications/clear");
      setNotifications([]);
      setUnreadCount(0);
      if (updateUnreadCount) {
        updateUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
      setError("Failed to clear notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Box 
        sx={{ 
          width: 400,
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          maxHeight: '80vh',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem' }}>
            Notifications
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {notifications.length > 0 && (
              <Tooltip title="Clear all notifications" arrow>
                <IconButton
                  size="small"
                  onClick={clearAllNotifications}
                  sx={{ 
                    color: 'text.disabled',
                    '&:hover': {
                      color: theme.palette.error.main,
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{ 
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Mark all as read
              </Button>
            )}
            <IconButton 
              size="small" 
              onClick={onClose}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        
        {/* Notification List */}
        <Box sx={{ 
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
            borderRadius: '3px',
          }
        }}>
          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Loading notifications...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={fetchNotifications}
                sx={{ mt: 1 }}
              >
                Retry
              </Button>
            </Box>
          ) : notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <NotificationsIcon 
                    sx={{ 
                      fontSize: 32,
                      color: 'text.disabled',
                      opacity: 0.8
                    }} 
                  />
                </Box>
                <Typography variant="body1" fontWeight={500} color="text.primary" sx={{ mb: 0.5 }}>
                  No notifications yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  When you get notifications, they'll appear here
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <List disablePadding>
              <AnimatePresence>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    markAsRead={async (id) => {
                      try {
                        await api.post(`/api/notifications/${id}/read`);
                        await fetchNotifications();
                      } catch (err) {
                        console.error("Failed to mark as read:", err);
                        setError("Failed to mark notification as read");
                      }
                    }}
                  />
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>
        
        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ 
            p: 1.5, 
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            <Button
              variant="text"
              size="small"
              fullWidth
              onClick={onClose}
              sx={{ 
                textTransform: 'none',
                color: theme.palette.primary.main,
                fontSize: '0.85rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Close notifications
            </Button>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default NotificationPanel;