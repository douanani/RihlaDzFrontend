import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  Chip,
  Button,
  Box,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Subject as SubjectIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MessageDetailsModal = ({ open, onClose, message }) => {
  if (!message) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          background: "linear-gradient(to bottom right, #f8fafc, #ffffff)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          position: "relative",
        },
      }}
    >
      {/* Animated background decoration */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: 120,
          background:
            "linear-gradient(135deg, rgba(134,184,23,0.1) 0%, rgba(84,154,245,0.1) 100%)",
          zIndex: 0,
        }}
      />

      <DialogTitle
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 3,
          pb: 2,
          bgcolor: "transparent",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="700" color="#2d3748">
            Message Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Full content and sender information
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "#ef4444",
              bgcolor: "rgba(239,68,68,0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ position: "relative", pt: 3 }}>
        <Box
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          sx={{ mb: 4 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#86b817",
                color: "white",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {message.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {message.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <EmailIcon fontSize="small" sx={{ color: "#64748b" }} />
                <Typography variant="body2" color="text.secondary">
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
                  <PhoneIcon fontSize="small" sx={{ color: "#64748b" }} />
                  <Typography variant="body2" color="text.secondary">
                    {message.phone}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            sx={{ mb: 3 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(message.created_at).toLocaleString()}
              </Typography>
              {message.status === "unread" && (
                <Chip
                  label="Unread"
                  size="small"
                  sx={{
                    bgcolor: "#86b817",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.65rem",
                    height: 20,
                    ml: 1,
                  }}
                />
              )}
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "rgba(134,184,23,0.05)",
                borderRadius: 2,
                borderLeft: "4px solid #86b817",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <SubjectIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight="600">
                  Subject:
                </Typography>
                <Typography variant="subtitle1">
                  {message.subject || "No subject"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <MessageIcon color="primary" sx={{ fontSize: 20, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Message:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                    }}
                  >
                    {message.message}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "rgba(0,0,0,0.02)",
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
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
          Close
        </Button>
       <Button
  variant="contained"
  startIcon={<EmailIcon />}
  onClick={() => {
    window.location.href = `mailto:${message.email}?subject=Re: ${encodeURIComponent(
      message.subject || 'Your Message'
    )}`;
  }}
  sx={{
    bgcolor: "#86b817",
    color: "white",
    borderRadius: 2,
    px: 3,
    "&:hover": {
      bgcolor: "#7aa616",
      boxShadow: "0 4px 6px -1px rgba(134,184,23,0.3)",
    },
  }}
>
  Reply
</Button>

      </DialogActions>
    </Dialog>
  );
};

export default MessageDetailsModal;
