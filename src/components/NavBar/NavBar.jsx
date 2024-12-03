import * as React from "react";
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
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/QAirlineLogoFinal.png";

const pages = ["Flights", "Aircrafts", "Tickets", "News"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar color="white" position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={Logo} style={{ height: "3rem", margin: "0" }} />

          <Box
            sx={{
              flexGrow: 1,
              display: { marginLeft: "2rem", display: "flex" },
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
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
