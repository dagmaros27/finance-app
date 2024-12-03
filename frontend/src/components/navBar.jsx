import React, { useCallback, useContext, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/provider";

const NAV_ITEMS = [
  { label: "Deposit", path: "/" },
  { label: "Report", path: "/report" },
];

const USER_SETTINGS = [
  { label: "Account", action: "account" },
  { label: "Logout", action: "logout" },
];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { logout, user } = useContext(AppContext);
  const navigate = useNavigate();

  const handleMenuToggle = useCallback(
    (setter) => (event) => {
      setter(event.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(
    (setter) => () => {
      setter(null);
    },
    []
  );

  const handleNavigation = useCallback(
    (path) => {
      handleMenuClose(setAnchorElNav)();
      navigate(path);
    },
    [navigate]
  );

  const handleUserAction = useCallback(
    (action) => {
      handleMenuClose(setAnchorElUser)();
      if (action === "logout") {
        logout();
        navigate("/signIn");
      } else if (action === "account") {
        navigate("/account");
      }
    },
    [logout, navigate]
  );

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuToggle(setAnchorElNav)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleMenuClose(setAnchorElNav)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {NAV_ITEMS.map(({ label, path }) => (
                <MenuItem key={label} onClick={() => handleNavigation(path)}>
                  <Typography>{label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {NAV_ITEMS.map(({ label, path }) => (
              <Button
                key={label}
                onClick={() => handleNavigation(path)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleMenuToggle(setAnchorElUser)}
                sx={{ p: 0 }}
              >
                <Avatar
                  style={{ backgroundColor: "#000" }}
                  alt={user?.username.toUpperCase() || "User"}
                  src="/static/images/avatar/1.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleMenuClose(setAnchorElUser)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ mt: "45px" }}
            >
              {USER_SETTINGS.map(({ label, action }) => (
                <MenuItem key={label} onClick={() => handleUserAction(action)}>
                  <Typography>{label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default React.memo(NavBar); // Memoizing to prevent unnecessary re-renders
