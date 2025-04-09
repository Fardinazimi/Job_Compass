import { Box, Typography, Paper, Link, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../state/ThemeContext";
import { useAuth } from "./context/AuthContext";

const InfoPage = () => {
  const { mode } = useContext(ThemeContext);
  const { isLoggedIn } = useAuth();

  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <Box
      sx={{
        p: 4,
        minWidth: "100vw",
        minHeight: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(to bottom, #ffffff, #7C3AED, #ffffff)"
            : "linear-gradient(to bottom, #121212, #1f1f1f)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: mode === "light" ? "#7C3AED" : "#ffffff",
          textShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          mb: 4,
          mt: 8,
        }}
      >
        Features & Company Information
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              boxShadow: 3,
              borderRadius: "12px",
              backgroundColor: mode === "light" ? "#ffffff" : "#1f1f1f",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#7C3AED" }}
            >
              Features
            </Typography>
            <Box sx={{ mt: 2 }} id="features">
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Application Tracking:</strong> Keep track of your job
                applications easily.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Job Search:</strong> Find and apply to job openings
                effortlessly.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Analytics:</strong> Visualize the progress of your job
                search.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              boxShadow: 3,
              borderRadius: "12px",
              backgroundColor: mode === "light" ? "#ffffff" : "#1f1f1f",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#7C3AED" }}
            >
              Company
            </Typography>
            <Box sx={{ mt: 2 }} id="company">
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>About Us:</strong> ob Compass was founded by a team of
                passionate developers who wanted to make the job search process
                easier. Our goal is to help job seekers stay organized and
                motivated while they pursue their dream careers.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Careers:</strong> We are always on the lookout for
                talented and driven individuals to help us build innovative
                products. If you are passionate about helping others achieve
                their career goals, we would love to hear from you.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Privacy Policy:</strong> We are committed to protecting
                your privacy. Your personal data will never be shared without
                your consent, and we are transparent about how we use your
                information.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              boxShadow: 3,
              borderRadius: "12px",
              backgroundColor: mode === "light" ? "#ffffff" : "#1f1f1f",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#7C3AED" }}
            >
              Meet the Team
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Our team consists of Fardin, Goitseone, and Martin. We are a
                group of passionate student web developers who created Job
                Compass to help job seekers manage their applications and job
                search more effectively. With our combined expertise in web
                development, we aim to simplify the job search process for users
                worldwide.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Link
          href={isLoggedIn ? "/home" : "/"}
          color="inherit"
          sx={{
            fontSize: "16px",
            textDecoration: "none",
            backgroundColor: "#7C3AED",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#6A2D9F",
            },
          }}
        >
          Back to Home
        </Link>
      </Box>
    </Box>
  );
};

export default InfoPage;
