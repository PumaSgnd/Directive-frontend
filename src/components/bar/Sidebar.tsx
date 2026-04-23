import { useEffect, useMemo, useState } from "react";
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
  Group,
  ExpandLess,
  ExpandMore,
  Calculate,
  Person,
  Groups,
  Gavel,
  EmojiEvents,
  SportsScore,
  MilitaryTech,
  History,
  ManageAccounts
} from "@mui/icons-material";
import directiveLogo from "../../assets/direc.png";
import Logo from "../../assets/logo.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import * as React from "react";

const drawerWidthOpen = 260;
const drawerWidthClose = 70;

const Sidebar: React.FC = () => {
  const location = useLocation();
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
          { text: "User Management", icon: <ManageAccounts />, path: "/datamaster/usermanagement" },
          { text: "PIC", icon: <Person />, path: "/datamaster/pic" },
          { text: "Peserta", icon: <Groups />, path: "/datamaster/peserta" },
          { text: "Juri", icon: <Gavel />, path: "/datamaster/juri" },
        ]
      },
      {
        text: "Turnamen",
        icon: <EmojiEvents />,
        children: [
          { text: "Babak penyisihan", icon: <SportsScore />, path: "/datamaster/discipline/discipline" },
          { text: "8 besar(perempat)", icon: <MilitaryTech />, path: "/datamaster/category-discipline" },
          { text: "Semi final", icon: <MilitaryTech />, path: "/datamaster/sub-category-discipline" },
          { text: "Final", icon: <EmojiEvents />, path: "/datamaster/sub-category-discipline" }
        ]
      },
      {
        text: "Hitung Turnamen",
        icon: <Calculate />,
        children: [
          { text: "Controller", icon: <Calculate />, path: "/hitungTurnamen/controller" },
          { text: "Skor", icon: <SportsScore />, path: "/datamaster/discipline/discipline" },
          { text: "History", icon: <History />, path: "/datamaster/category-discipline" }
        ]
      }
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

  useEffect(() => {
    menuItems.forEach(menu => {
      if (menu.children) {
        menu.children.forEach(child => {
          if (location.pathname.startsWith(child.path)) {
            setOpenMenus(prev => ({
              ...prev,
              [menu.text]: true
            }));
          }
        });
      }
    });
  }, [location.pathname]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMenuItems = (items: any[], level = 0) =>
    items.map((item, index) => {
      const isActive =
        item.path && location.pathname.startsWith(item.path);
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus[item.text] || false;

      return (
        <React.Fragment key={`${item.text}-${index}`}>
          <ListItemButton
            selected={isActive}
            onClick={() =>
              hasChildren
                ? handleToggleMenu(item.text)
                : handleMenuItemClick(item.path, item.text)
            }
            sx={{ pl: 2 + level * 2, py: sidebarOpen ? 2 : 2.5, justifyContent: sidebarOpen ? "flex-start" : "center", }}
            role="menuitem"
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarOpen ? 2 : "auto",
                  justifyContent: "center",
                  width: sidebarOpen ? "auto" : "100%",
                  color: level === 0 ? "inherit" : "text.secondary"
                }}
              >
                {React.cloneElement(item.icon, {
                  fontSize: level === 0 ? "medium" : "small"
                })}
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
