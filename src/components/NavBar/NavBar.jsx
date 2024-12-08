import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import Logo from "../../assets/QAirlineLogoFinal.png";

const pages = ["Flights", "Aircrafts", "Tickets", "News"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === "Logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    setAnchorElUser(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar color="white" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={Logo} alt="Logo" style={{ height: "3rem", margin: "0" }} />
          {/* Mobile Menu Icon */}
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ ml: "auto" }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{
                    width: 250,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List>
                    {pages.map((page) => {
                      const isOnFlight = page === "Flights";
                      const isActive = !isOnFlight
                        ? location.pathname === `/dashboard/${page}`
                        : location.pathname === `/dashboard`;
                      return (
                        <Link
                          to={`/dashboard/${page}`}
                          key={page}
                          style={{
                            textDecoration: "none",
                            color: isActive
                              ? theme.palette.primary.main
                              : "inherit",
                          }}
                        >
                          <ListItem>
                            <ListItemText primary={page} />
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                  <Divider />
                  <List>
                    {settings.map((setting) => (
                      <ListItem
                        key={setting}
                        onClick={() => handleCloseUserMenu(setting)}
                      >
                        <ListItemText primary={setting} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            /* Desktop Menu */
            <Box
              sx={{
                flexGrow: 1,
                ml: 2,
                display: "flex",
              }}
            >
              {pages.map((page) => {
                const isOnFlight = page === "Flights";
                const isActive = !isOnFlight
                  ? location.pathname === `/dashboard/${page}`
                  : location.pathname === `/dashboard`;
                return (
                  <Link
                    to={`/dashboard/${page}`}
                    key={page}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      key={page}
                      sx={{
                        fontSize: "1.2rem",
                        height: "100%",
                        display: "block",
                        backgroundColor: isActive ? "primary.main" : "inherit",
                        color: isActive ? "white" : "inherit",
                        "&:hover": {
                          backgroundColor: isActive
                            ? "primary.main"
                            : "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      {page}
                    </Button>
                  </Link>
                );
              })}
            </Box>
          )}

          {/* Profile Avatar */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
