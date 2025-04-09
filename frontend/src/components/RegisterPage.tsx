import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  IconButton,
  Grid,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { ThemeContext } from "../state/ThemeContext";
import { signInWithGoogle } from "../firebaseConfig";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

const RegisterPage = () => {
  const { mode } = useContext(ThemeContext);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    // Only check if password is more than 4 characters
    return password.length > 4;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(registerData.password)) {
      alert("Password must be more than 4 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2000/api/auth/register",
        registerData
      );
      alert("Registration successful! Please sign in.");
      console.log("Register Success:", response.data);

      setRegisterData({ name: "", email: "", password: "" });
      navigate("/auth/signin");
    } catch (error: any) {
      console.error("Register Error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = async () => {
    const user = await signInWithGoogle();
    if (user && user.displayName && user.email) {
      try {
        const response = await axios.post(
          "http://localhost:2000/api/auth/google-register",
          {
            name: user.displayName,
            email: user.email,
          }
        );
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName);

        navigate("/auth/signin");
      } catch (error) {
        console.error("Google Register Backend Error:", error);
      }
    } else {
      console.error("Google login failed: Missing user details.");
    }
  };

  const handleFacebookRegister = async () => {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        getAuth(),
        new FacebookAuthProvider()
      );
      const user = userCredential.user;

      if (user && user.displayName && user.email) {
        const response = await axios.post(
          "http://localhost:2000/api/auth/facebook-register",
          {
            name: user.displayName,
            email: user.email,
          }
        );
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName);

        navigate("/auth/signin");
      }
    } catch (error) {
      console.error("Facebook Register Error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background:
          mode === "light"
            ? "linear-gradient(to bottom, #4c4f8c, #b87dd8)"
            : "linear-gradient(to bottom, #121212, #1f1f1f)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          borderRadius: "12px",
          backgroundColor: mode === "light" ? "#fff" : "#222",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: mode === "light" ? "#4c4f8c" : "#ffffff" }}
        >
          Register
        </Typography>
        <form onSubmit={handleRegisterSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={registerData.name}
            onChange={handleRegisterChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleRegisterChange}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                color="primary"
              />
            }
            label="Show Password"
          />

          {/* WOW Register Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              background: "linear-gradient(135deg, #9B51E0, #7C3AED)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "8px",
              "&:hover": { transform: "scale(1.05)" },
              "&:active": { transform: "scale(0.95)" },
            }}
          >
            REGISTER
          </Button>

          {/* Google & Facebook Buttons */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <IconButton
                onClick={handleGoogleRegister}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  "&:hover": { transform: "scale(1.05)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <GoogleIcon sx={{ color: "#ff0000" }} />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <IconButton
                onClick={handleFacebookRegister}
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  "&:hover": { transform: "scale(1.05)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <FacebookIcon sx={{ color: "#1877F2" }} />
              </IconButton>
            </Grid>
          </Grid>

          <Typography sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/auth/signin")}
              sx={{
                color: "#7C3AED",
                fontWeight: "bold",
                "&:hover": { transform: "scale(1.05)" },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              SIGN IN
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
