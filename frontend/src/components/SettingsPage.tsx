import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Switch,
  Button,
  Paper,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { ThemeContext } from "../state/ThemeContext";

interface UserSettings {
  name: string;
  email: string;
  theme: "light" | "dark";
  weeklyReminder: boolean;
  monthlyReminder: boolean;
  emailNotification: boolean;
  profilePicture?: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, toggleMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    theme: mode as "light" | "dark",
    weeklyReminder: false,
    monthlyReminder: false,
    emailNotification: false,
    profilePicture: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileChanges, setProfileChanges] = useState({
    currentName: "",
    newName: "",
    confirmNewName: "",
    currentEmail: "",
    newEmail: "",
    confirmNewEmail: "",
  });
  const [emailNotification, setEmailNotification] = useState(
    settings?.emailNotification || false
  );
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:2000/api/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.email) {
        setSettings({
          name: data.name || "",
          email: data.email || "",
          theme: data.theme || mode,
          weeklyReminder: data.weeklyReminder || false,
          monthlyReminder: data.monthlyReminder || false,
          emailNotification: data.emailNotification || false,
          profilePicture: data.profilePicture || "",
        });
        setProfilePicturePreview(data.profilePicture || null);
        setProfileChanges((prev) => ({
          ...prev,
          currentName: data.name || "",
        }));
        setEmailNotification(data.emailNotification || false);
      } else {
        throw new Error("Invalid data received from server");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError(error instanceof Error ? "Unable to load settings" : "");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePictureFile) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", profilePictureFile);

    try {
      console.log("Uploading profile picture:", {
        fileName: profilePictureFile.name,
        fileSize: profilePictureFile.size,
        fileType: profilePictureFile.type,
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:2000/api/settings/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings((prev) => ({
        ...prev,
        profilePicture: response.data.profilePictureUrl,
      }));
      setSuccess("Profile picture uploaded successfully");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          (error instanceof Error
            ? error.message
            : "Failed to upload profile picture")
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "weeklyReminder" || name === "monthlyReminder") {
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "emailNotification") {
      setEmailNotification(checked);
      setSettings((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    // Clear any existing errors when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileChanges((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Add validation for name change
    if (name === "newName") {
      setProfileChanges((prev) => ({
        ...prev,
        confirmNewName:
          prev.confirmNewName === prev.newName ? value : prev.confirmNewName,
      }));
    }

    // Clear any existing errors when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    toggleMode();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate inputs
    if (
      profileChanges.newName &&
      profileChanges.newName !== profileChanges.confirmNewName
    ) {
      setError("Name confirmation does not match");
      setLoading(false);
      return;
    }

    if (
      profileChanges.newEmail &&
      profileChanges.newEmail !== profileChanges.confirmNewEmail
    ) {
      setError("Email confirmation does not match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Prepare settings update payload
      const updatePayload: any = {
        name: profileChanges.newName || settings.name,
        theme: settings.theme,
        weeklyReminder: settings.weeklyReminder,
        monthlyReminder: settings.monthlyReminder,
        emailNotification: emailNotification,
      };

      // Add email if changed and confirmed
      if (
        profileChanges.newEmail &&
        profileChanges.newEmail === profileChanges.confirmNewEmail
      ) {
        updatePayload.email = profileChanges.newEmail;
      }

      // Add password change if attempting to change
      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setError("New passwords do not match");
          setLoading(false);
          return;
        }
        updatePayload.currentPassword = passwords.currentPassword;
        updatePayload.newPassword = passwords.newPassword;
      }

      // Send update request
      const response = await axios.patch(
        "http://localhost:2000/api/settings/update",
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with response
      setSettings((prev) => ({
        ...prev,
        ...response.data,
      }));

      // Reset form states
      setProfileChanges({
        currentName: response.data.name || profileChanges.currentName,
        newName: "",
        confirmNewName: "",
        currentEmail: response.data.email || profileChanges.currentEmail,
        newEmail: "",
        confirmNewEmail: "",
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Settings updated successfully!");
    } catch (error: any) {
      console.error("Full settings update error:", {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        serverError: error.response?.data,
      });

      setError(
        error.response?.data?.message ||
          "Failed to update settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(to bottom, #ffffff, #7C3AED,#ffffff)"
            : "linear-gradient(to bottom, #121212, #1f1f1f)",
        position: "relative",
        p: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          maxWidth: 1200,
          minHeight: "80vh",
          maxHeight: "95vh",
          overflowY: "auto",

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "background.paper",
            pt: 2,
            pb: 1,
          }}
        >
          Settings
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, position: "sticky", top: "60px", zIndex: 10 }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2, position: "sticky", top: "60px", zIndex: 10 }}
          >
            {success}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                justifyContent: "space-between",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Profile Picture
                </Typography>
                <Avatar
                  src={profilePicturePreview || settings.profilePicture}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    mx: "auto",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-picture-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                  />
                  <label htmlFor="profile-picture-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Change Profile Picture
                    </Button>
                  </label>
                  {profilePictureFile && (
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={uploadProfilePicture}
                    >
                      Upload Picture
                    </Button>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <TextField
                  fullWidth
                  label="Current Name"
                  name="currentName"
                  value={profileChanges.currentName}
                  onChange={handleProfileChange}
                  disabled
                  helperText="Your current name"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="New Name"
                  name="newName"
                  value={profileChanges.newName}
                  onChange={handleProfileChange}
                  helperText="Enter your new name"
                  sx={{ mb: 2 }}
                />
                {profileChanges.newName && (
                  <TextField
                    fullWidth
                    label="Confirm New Name"
                    name="confirmNewName"
                    value={profileChanges.confirmNewName}
                    onChange={handleProfileChange}
                    error={
                      profileChanges.confirmNewName !== "" &&
                      profileChanges.newName !== profileChanges.confirmNewName
                    }
                    helperText={
                      profileChanges.confirmNewName !== "" &&
                      profileChanges.newName !== profileChanges.confirmNewName
                        ? "New names do not match"
                        : "Confirm your new name"
                    }
                    sx={{ mb: 2 }}
                  />
                )}
                <TextField
                  fullWidth
                  required
                  label="Current Email"
                  name="currentEmail"
                  type="email"
                  value={profileChanges.currentEmail}
                  onChange={handleProfileChange}
                  helperText="Enter your current email address"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="New Email"
                  name="newEmail"
                  type="email"
                  value={profileChanges.newEmail}
                  onChange={handleProfileChange}
                  helperText="Enter your new email address"
                  sx={{ mb: 2 }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                justifyContent: "space-between",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.theme === "dark"}
                      onChange={handleThemeChange}
                    />
                  }
                  label="Dark Theme"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.weeklyReminder}
                      onChange={handleInputChange}
                      name="weeklyReminder"
                    />
                  }
                  label="Weekly Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.monthlyReminder}
                      onChange={handleInputChange}
                      name="monthlyReminder"
                    />
                  }
                  label="Monthly Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotification}
                      onChange={handleInputChange}
                      name="emailNotification"
                    />
                  }
                  label="Email Notifications"
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Password Change
                </Typography>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  error={
                    passwords.confirmPassword !== "" &&
                    passwords.newPassword !== passwords.confirmPassword
                  }
                  helperText={
                    passwords.confirmPassword !== "" &&
                    passwords.newPassword !== passwords.confirmPassword
                      ? "New passwords do not match"
                      : ""
                  }
                />
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                position: "sticky",
                bottom: 0,
                zIndex: 10,
              }}
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
