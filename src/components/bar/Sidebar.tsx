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
  ManageAccounts,
  Scoreboard
} from "@mui/icons-material";
import directiveLogo from "../../assets/direc.png";
import Logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import * as React from "react";
import { SvgIconProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const drawerWidthOpen = 260;
const drawerWidthClose = 70;

type MenuItemType = {
  text: string;
  icon?: React.ReactElement<SvgIconProps>;
  path?: string;
  children?: MenuItemType[];
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar, setPageTitle } = useStore();
  const { t } = useTranslation();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuItems: MenuItemType[] = useMemo(
    () => [
      { text: "dashboard", icon: <Dashboard />, path: "/dashboard" },
      {
        text: "dataMaster",
        icon: <Group />,
        children: [
          { text: "userManagement", icon: <ManageAccounts />, path: "/datamaster/usermanagement" },
          { text: "pic", icon: <Person />, path: "/datamaster/pic" },
          { text: "peserta", icon: <Groups />, path: "/datamaster/peserta" },
          { text: "juri", icon: <Gavel />, path: "/datamaster/juri" }
        ]
      },
      {
        text: "turnamen",
        icon: <EmojiEvents />,
        children: [
          { text: "penyisihan", icon: <SportsScore />, path: "/pertandingan/penyisihan" },
          { text: "enambelasBesar", icon: <EmojiEvents />, path: "/pertandingan/enambelasbesar" },
          { text: "perempat", icon: <MilitaryTech />, path: "/pertandingan/perempat-final" },
          { text: "semiFinal", icon: <MilitaryTech />, path: "/pertandingan/semi-final" },
          { text: "final", icon: <EmojiEvents />, path: "/pertandingan/final" }
        ]
      },
      { text: "hitungTurnamen", icon: <Calculate />, path: "/hitungTurnamen" },
      {
        text: "skor",
        icon: <Scoreboard />,
        children: [
          { text: "penyisihan", icon: <SportsScore />, path: "/skor/penyisihan" },
          { text: "enambelasBesar", icon: <EmojiEvents />, path: "/skor/enambelasbesar" },
          { text: "perempat", icon: <MilitaryTech />, path: "/skor/perempat-final" },
          { text: "semiFinal", icon: <MilitaryTech />, path: "/skor/semi-final" },
          { text: "final", icon: <EmojiEvents />, path: "/skor/final" }
        ]
      }
      // { text: "skor", icon: <Scoreboard />, path: "/hitungTurnamen/skor" }
    ],
    []
  );

  const handleMenuItemClick = (path: string, text: string) => {
    setPageTitle(t(text));
    navigate(path);
  };

  const handleToggleMenu = (menuText: string) => {
    setOpenMenus(prev => ({
      [menuText]: !prev[menuText]
    }));
  };

  useEffect(() => {
    menuItems.forEach(menu => {
      if (menu.children) {
        menu.children.forEach(child => {
          if (child.path && location.pathname.startsWith(child.path)) {
            setOpenMenus(prev => ({
              ...prev,
              [menu.text]: true
            }));
          }
        });
      }
    });
  }, [location.pathname, menuItems]);

  const renderMenuItems = (
    items: MenuItemType[],
    level = 0
  ): React.ReactNode =>
    items.map((item, index) => {
      const isActive =
        item.path && location.pathname.startsWith(item.path);

      const hasChildren = !!item.children?.length;
      const isOpen = openMenus[item.text] || false;

      return (
        <React.Fragment key={`${item.text}-${index}`}>
          <ListItemButton
            selected={!!isActive}
            onClick={() =>
              hasChildren
                ? handleToggleMenu(item.text)
                : item.path && handleMenuItemClick(item.path, item.text)
            }
            sx={{
              pl: 2 + level * 2,
              py: sidebarOpen ? 2 : 2.5,
              justifyContent: sidebarOpen ? "flex-start" : "center",
              transition: "background-color 0.2s ease" // ✅ fix kedip hover
            }}
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

            {sidebarOpen && (
              <ListItemText primary={t(item.text)} />
            )}

            {hasChildren && sidebarOpen && (
              isOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>

          {hasChildren && (
            <Collapse in={isOpen} timeout={0} unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children!, level + 1)}
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
          height: 60,
          cursor: "pointer",
          p: 2
        }}
        onClick={toggleSidebar}
      >
        <img
          src={sidebarOpen ? directiveLogo : Logo}
          alt="Logo"
          style={{
            width: sidebarOpen ? 120 : 40,
            transition: "width 0.3s"
          }}
        />
      </Box>

      <Divider />

      <List>
        {renderMenuItems(menuItems)}
      </List>
    </Drawer>
  );
};

export default Sidebar;