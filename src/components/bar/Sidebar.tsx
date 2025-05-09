import React, { useMemo, useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Collapse
} from "@mui/material";
import {
  Dashboard,
  Assignment,
  Group,
  Hotel,
  ExitToApp,
  Description,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material";
import directiveLogo from "../../assets/direc.png";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";

const drawerWidthOpen = 240;
const drawerWidthClose = 70;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar, setPageTitle } = useStore();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const menuItems = useMemo(
    () => [
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      {
        text: "Data Master",
        icon: <Group />,
        children: [
          { text: "PIC", path: "/datamaster/pic" },
          {
            text: "Discipline",
            children: [
              { text: "Discipline", path: "/datamaster/discipline/discipline" },
              { text: "Category Discipline", path: "/datamaster/category-discipline" },
              { text: "Sub-Category Discipline", path: "/datamaster/sub-category-discipline" }
            ]
          },
          { text: "Email Receive", path: "/data-master/email-receive" },
          { text: "Hotel", path: "/data-master/hotel" },
          { text: "Signature", path: "/data-master/signature" }
        ]
      },
      { text: "Competition", icon: <Assignment />, path: "/competition" },
      { text: "Accommodation", icon: <Hotel />, path: "/accommodation" },
      { text: "Directive", icon: <Description />, path: "/directive" },
      { text: "Registration", icon: <Assignment />, path: "/registration" },
      { text: "Apply Accommodation", icon: <Hotel />, path: "/apply-accommodation" },
      { text: "Report", icon: <ExitToApp />, path: "/report" }
    ],
    []
  );

  const handleMenuItemClick = (path: string, text: string) => {
    setPageTitle(text);
    navigate(path);
  };

  const handleToggleMenu = (menuText: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText]
    }));
  };

  const renderMenuItems = (items: any[], level = 0) =>
    items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus[item.text] || false;

      return (
        <React.Fragment key={`${item.text}-${index}`}>
          <ListItemButton
            onClick={() =>
              hasChildren
                ? handleToggleMenu(item.text)
                : handleMenuItemClick(item.path, item.text)
            }
            sx={{ pl: 2 + level * 2 }}
            role="menuitem"
          >
            {item.icon && level === 0 && (
              <ListItemIcon
                sx={{ minWidth: 0, mr: sidebarOpen ? 2 : "auto", justifyContent: "center" }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            {sidebarOpen && <ListItemText primary={item.text} />}
            {hasChildren && sidebarOpen && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          {hasChildren && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding role="group">
                {renderMenuItems(item.children, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? drawerWidthOpen : drawerWidthClose,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": {
          width: sidebarOpen ? drawerWidthOpen : drawerWidthClose,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: "#f4f4f4"
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 30,
          cursor: "pointer",
          p: 2
        }}
        onClick={toggleSidebar}
        role="button"
        aria-label="Toggle Sidebar"
      >
        <img
          src={sidebarOpen ? directiveLogo : Logo}
          alt="Logo"
          style={{ width: sidebarOpen ? 120 : 40, transition: "width 0.3s" }}
        />
      </Box>
      <Divider />
      <List role="menu">{renderMenuItems(menuItems)}</List>
    </Drawer>
  );
};

export default Sidebar;
