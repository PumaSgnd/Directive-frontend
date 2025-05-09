import React, { useState } from "react";
import {
  Avatar, Box, Typography, Menu, MenuItem, ListItemIcon, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { useAuth } from "../../hooks/useAuth";
import { useAutoLogout } from "../../hooks/useAutoLogout";

const UserMenu: React.FC = () => {
  useAuth();
  useAutoLogout();
  const navigate = useNavigate();
  const { user } = useStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        role="button"
        aria-haspopup="true"
        aria-controls="user-menu"
      >
        <Avatar alt="Developer profile" src="/profile.jpg" sx={{ width: 45, height: 45 }} />
        <Box sx={{ lineHeight: 1 }}>
          <Typography fontWeight={600} fontSize={18}>
            {user ? capitalizeWords(user.full_name || "Unknown User") : "Unknown User"}
          </Typography>
          <Typography fontSize={12} color="gray">
            Super Admin
          </Typography>
        </Box>
      </Box>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>Account
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); setOpenDialog(true); }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>Logout
        </MenuItem>
      </Menu>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error">Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserMenu;
