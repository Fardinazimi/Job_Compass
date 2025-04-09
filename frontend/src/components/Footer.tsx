import { Box, Typography, Link } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        padding: "40px 20px",
        textAlign: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 4,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10px",
            width: { xs: "100%", sm: "25%" },
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Job Compass
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            Your career navigation tool to help you find, track, and manage job
            applications.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10px",
            width: { xs: "100%", sm: "25%" },
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Features
          </Typography>
          <Link
            href="/info#features"
            color="inherit"
            sx={{
              "&:hover": { color: "#7C3AED" },
              textDecoration: "none",
            }}
          >
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              Application Tracking
            </Typography>
          </Link>
          <Link
            href="/info#features"
            color="inherit"
            sx={{
              "&:hover": { color: "#7C3AED" },
              textDecoration: "none",
            }}
          >
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              Job Search
            </Typography>
          </Link>
          <Link
            href="/info#features"
            color="inherit"
            sx={{
              "&:hover": { color: "#7C3AED" },
              textDecoration: "none",
            }}
          >
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              Analytics
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10px",
            width: { xs: "100%", sm: "25%" },
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Company
          </Typography>
          <Link
            href="/info#company"
            color="inherit"
            sx={{
              "&:hover": { color: "#7C3AED" },
              textDecoration: "none",
            }}
          >
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              About Us
            </Typography>
          </Link>
          <Link
            href="/info#company"
            color="inherit"
            sx={{
              "&:hover": { color: "#7C3AED" },
              textDecoration: "none",
            }}
          >
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              Careers
            </Typography>
          </Link>
          <Link
            href="/info#company"
            color="inherit"
            sx={{
              "&:hover": { color: "#7C3AED" },
              textDecoration: "none",
            }}
          >
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              Privacy Policy
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10px",
            width: { xs: "100%", sm: "25%" },
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Connect
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Link
              href="https://www.facebook.com"
              color="inherit"
              sx={{
                "&:hover": { color: "#7C3AED" },
                textDecoration: "none",
              }}
            >
              <Facebook />
            </Link>
            <Link
              href="https://twitter.com"
              color="inherit"
              sx={{
                "&:hover": { color: "#7C3AED" },
                textDecoration: "none",
              }}
            >
              <Twitter />
            </Link>
            <Link
              href="https://www.instagram.com"
              color="inherit"
              sx={{
                "&:hover": { color: "#7C3AED" },
                textDecoration: "none",
              }}
            >
              <Instagram />
            </Link>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2">
          © 2025 Job Compass, All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
