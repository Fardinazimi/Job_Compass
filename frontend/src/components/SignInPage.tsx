import React, { useState, useContext } from "react";
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
import { signInWithGoogle, signInWithFacebook } from "../firebaseConfig";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const SignInPage = () => {
  const { mode } = useContext(ThemeContext);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", signInData);
      console.log("Login response:", response.data);
      const { token, user } = response.data;
      const { name } = user;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);

      console.log("Sign In Success:", response.data);

      setSignInData({ email: "", password: "" });
      navigate("/home");
    } catch (error) {
      console.error("Sign In Error:", error);
      alert("Sign-in failed. Check your credentials and try again.");
    }
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user && user.displayName && user.email) {
      try {
        const response = await axios.post("/api/auth/google-login", {
          name: user.displayName,
          email: user.email,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName);
        navigate("/home");
      } catch (error) {
        console.error("Google Sign-In Backend Error:", error);
      }
    } else {
      console.error("Google login failed: Missing user details.");
    }
  };

  const handleFacebookLogin = async () => {
    const user = await signInWithFacebook();
    if (user && user.displayName && user.email) {
      try {
        const response = await axios.post("/api/auth/facebook-login", {
          name: user.displayName,
          email: user.email,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.displayName);
        navigate("/home");
      } catch (error) {
        console.error("Facebook Sign-In Backend Error:", error);
      }
    } else {
      console.error("Facebook login failed: Missing user details.");
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
        backgroundSize: "400% 400%",
        animation: "shinyEffect 3s ease infinite",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSignInSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={signInData.email}
            onChange={handleSignInChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={signInData.password}
            onChange={handleSignInChange}
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
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Box sx={{ width: "100%" }}>
                <IconButton
                  color="error"
                  sx={{ width: "100%" }}
                  onClick={handleGoogleLogin}
                >
                  <GoogleIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ width: "100%" }}>
                <IconButton
                  color="primary"
                  sx={{ width: "100%" }}
                  onClick={handleFacebookLogin}
                >
                  <FacebookIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Not yet registered?{" "}
          <Button onClick={() => navigate("/auth/register")}>Register</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignInPage;
