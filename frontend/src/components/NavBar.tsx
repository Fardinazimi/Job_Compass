import { useState, useContext } from "react";
import { Box, Button, Typography, Drawer, IconButton } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import { ThemeContext } from "../state/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const { mode, toggleMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const goToHome = () => navigate("/home");
  const goToAnalytics = () => navigate("/analytics");
  const goToSettings = () => navigate("/settings");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => setOpenMenu(!openMenu);

  const hideMenu =
    location.pathname === "/" ||
    location.pathname === "/auth/signin" ||
    location.pathname === "/auth/register";

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#7C3AED",
        color: "white",
        padding: "10px 20px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", cursor: "pointer" }}
        onClick={() => navigate(isLoggedIn ? "/home" : "/")}
      >
        Job Compass
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
          {hideMenu ? (
            <Button
              sx={{ color: "white" }}
              onClick={() => navigate("/auth/signin")}
            >
              Sign In / Register
            </Button>
          ) : (
            isLoggedIn && (
              <>
                <Button sx={{ color: "white" }} onClick={goToHome}>
                  Home
                </Button>
                <Button sx={{ color: "white" }} onClick={goToAnalytics}>
                  Analytics
                </Button>
                <Button sx={{ color: "white" }} onClick={goToSettings}>
                  Settings
                </Button>
                <Button sx={{ color: "white" }} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )
          )}
        </Box>
        <IconButton
          onClick={toggleMode}
          sx={{ color: "white", fontSize: "24px" }}
        >
          {mode === "light" ? <FaSun /> : <FaMoon />}
        </IconButton>
        <IconButton
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={toggleMenu}
        >
          <Menu sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <Drawer anchor="right" open={openMenu} onClose={toggleMenu}>
        <Box sx={{ width: 250, p: 2 }}>
          <IconButton onClick={toggleMenu}>
            <Close sx={{ color: "black" }} />
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isLoggedIn ? (
              <>
                <Button onClick={goToHome}>Home</Button>
                <Button onClick={goToAnalytics}>Analytics</Button>
                <Button onClick={goToSettings}>Settings</Button>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth/signin")}>
                Sign In / Register
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
