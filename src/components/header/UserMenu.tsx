import * as React from "react";
import { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContentText,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { useAuth } from "../../hooks/useAuth";
import { useSessionManager } from "../../hooks/useSessionManager";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import LanguageIcon from "@mui/icons-material/Language";

const UserMenu: React.FC = () => {
  useAuth();
  useSessionManager();
  const navigate = useNavigate();
  const { user } = useStore();
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* USER BUTTON */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          alt="Profile"
          src="/profile.jpg"
          sx={{ width: 45, height: 45 }}
        />
        <Box>
          <Typography fontWeight={600} fontSize={16}>
            {user
              ? capitalizeWords(user.full_name || "Unknown User")
              : "Unknown User"}
          </Typography>
          <Typography fontSize={12} color="gray">
            {user
              ? capitalizeWords(user.role || "Unknown Role")
              : "Unknown Role"}
          </Typography>
        </Box>
      </Box>

      {/* MAIN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => {
          setAnchorEl(null);
          setLangAnchorEl(null);
        }}
      >
        {/* ACCOUNT */}
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          {t("account")}
        </MenuItem>

        {/* LANGUAGE (SUBMENU TRIGGER) */}
        <MenuItem
          onClick={(e) => setLangAnchorEl(e.currentTarget)}
        >
          <ListItemIcon><LanguageIcon /></ListItemIcon>
          Language
        </MenuItem>

        {/* LOGOUT */}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setOpenDialog(true);
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          {t("logout")}
        </MenuItem>
      </Menu>

      {/* LANGUAGE SUBMENU */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={() => setLangAnchorEl(null)}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem
          selected={i18n.language === "en"}
          onClick={() => {
            i18n.changeLanguage("en");
            setLangAnchorEl(null);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <ReactCountryFlag countryCode="US" svg style={{ width: 20 }} />
          </ListItemIcon>
          English
        </MenuItem>

        <MenuItem
          selected={i18n.language === "id"}
          onClick={() => {
            i18n.changeLanguage("id");
            setLangAnchorEl(null);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <ReactCountryFlag countryCode="ID" svg style={{ width: 20 }} />
          </ListItemIcon>
          Indonesia
        </MenuItem>
      </Menu>

      {/* LOGOUT DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("confirmLogout")}</DialogTitle>

        <DialogContentText sx={{ px: 3 }}>
          {t("confirmQuestion")}
        </DialogContentText>

        <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
          <Button onClick={() => setOpenDialog(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleLogout} color="error">
            {t("logout")}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default UserMenu;