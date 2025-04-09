import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkIcon from "@mui/icons-material/Work";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ThemeContext } from "../state/ThemeContext";

Chart.register(...registerables);

type AnalyticsData = {
  total: number;
  applied: number;
  interview: number;
  inReview: number;
  rejected: number;
  monthly: Record<
    string,
    { applied: number; interview: number; inReview: number; rejected: number }
  >;
  yearly: Record<
    string,
    { applied: number; interview: number; inReview: number; rejected: number }
  >;
};

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios

      .get("/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },

      })
      .then((response) => setAnalytics(response.data))
      .catch((error) => console.error("Error fetching analytics:", error));
  }, []);

  if (!analytics) return <Typography>Loading...</Typography>;

  const statusColors = ["#000000", "#248ae7", "#58BA51", "#6d46d2", "#d32f2f"];

  const cards = [
    {
      title: "Total Applications",
      value: analytics.total,
      icon: <WorkIcon />,
      color: statusColors[0],
    },
    {
      title: "Applied Applications",
      value: analytics.applied,
      icon: <HowToRegIcon />,
      color: statusColors[1],
    },
    {
      title: "Interview Applications",
      value: analytics.interview,
      icon: <TrendingUpIcon />,
      color: statusColors[2],
    },
    {
      title: "In Review Applications",
      value: analytics.inReview,
      icon: <HourglassEmptyIcon />,
      color: statusColors[3],
    },
    {
      title: "Rejected Applications",
      value: analytics.rejected,
      icon: <CancelIcon />,
      color: statusColors[4],
    },
  ];

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #6C4AED, #ffffff)"
            : "linear-gradient(135deg, #121212, #1f1f1f)",
        transition: "background 0.3s",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          color: "#ffffff",
          textShadow: "2px 2px 6px rgba(0, 0, 1)",
          p: 2,
          mt: 4,
          mb: 11,
          textAlign: "center",

        }}
      >
        Analytics Overview
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {cards.map((card, index) => (
      <Grid item xs={12} sm={6} md={2.2} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "12px",
                background: "white",
                color: "#333",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                position: "relative",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0, 0, 0, 0.5)",
                },
                borderLeft: `8px solid ${card.color}`,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {card.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {card.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Toggle Button Design */}
      <Box sx={{ mt: 8, mb: 6, textAlign: "center" }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => setView(newView || "monthly")}
          sx={{
            background: "#7C3AED",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <ToggleButton
            value="monthly"
            sx={{
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: "20px",
              background: view === "monthly" ? "#fff" : "transparent",
              color: view === "monthly" ? "#7C3AED" : "#fff",
              "&:hover": { backgroundColor: "#fff", color: "#7C3AED" },
            }}
          >
            📅 Monthly
          </ToggleButton>
          <ToggleButton
            value="yearly"
            sx={{
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: "20px",
              background: view === "yearly" ? "#fff" : "transparent",
              color: view === "yearly" ? "#7C3AED" : "#fff",
              "&:hover": { backgroundColor: "#fff", color: "#7C3AED" },
            }}
          >
            📆 Yearly
          </ToggleButton>
        </ToggleButtonGroup>
        <Box
          sx={{
            mt: 15,
            mb: 10,
            width: "100%",
            maxWidth: { xs: "100%", sm: "90%", height: 600 },
            margin: "0 auto",
            overflowX: "auto",
          }}
        >
          <Bar
            data={{
              labels:
                view === "monthly"
                  ? Object.keys(analytics.monthly)
                  : Object.keys(analytics.yearly),
              datasets: [
                {
                  label: "Applied",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.applied)
                      : Object.values(analytics.yearly).map((y) => y.applied),
                  backgroundColor: "#248ae7",
                },
                {
                  label: "Interview",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.interview)
                      : Object.values(analytics.yearly).map((y) => y.interview),
                  backgroundColor: "#58BA51",
                },
                {
                  label: "In Review",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.inReview)
                      : Object.values(analytics.yearly).map((y) => y.inReview),
                  backgroundColor: "#6d46d2",
                },
                {
                  label: "Rejected",
                  data:
                    view === "monthly"
                      ? Object.values(analytics.monthly).map((m) => m.rejected)
                      : Object.values(analytics.yearly).map((y) => y.rejected),
                  backgroundColor: "#d32f2f",
                },
              ],
            }}
            options={{
              responsive: true,

       

              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
              },

            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
