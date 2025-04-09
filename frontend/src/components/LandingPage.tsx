import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  useTheme,
  keyframes,
} from "@mui/material";
import office from "../assets/office.jpeg";
import { CheckCircle, BarChart, Notifications } from "@mui/icons-material";

import CountUp from "react-countup";

// Анимация за текста
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;



const LandingPage = () => {
  const theme = useTheme();

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          marginBottom: "10%",
          height: { xs: "40vh", md: "90vh" },
          backgroundImage: `url(${office})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflowX: "hidden",
          borderRadius: "24px", // По-силен border radius
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)", // Добавяне на сянка за "повдигнат" ефект
          transform: "translateY(0)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-8px)", // Леко повдигане при hover
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)", // По-силна сянка при hover
          },
        }}
      >
        {/* Welcome Container */}
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            textAlign: "center",
            padding: "20px",
            borderRadius: "16px",
            width: { xs: "90%", sm: "70%", md: "50%" },
            backdropFilter: "blur(4px)",
            marginTop: "20px", // Преместване на 20px надолу
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#A0A0A0",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 2)",
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
              fontWeight: "bold",
            }}
          >
            Welcome to Job Compass
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#A0A0A0",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 2)",
              mt: 2,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            Your ultimate job tracking and management tool.
          </Typography>
        </Box>
      </Box>

      {/* Cards Section */}
      <Container>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 3,
              color: "#A0A0A0",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)",
              //color: theme.palette.mode === "light" ? "black" : "white",
              animation: `${float} 3s infinite ease-in-out`, // Анимация за текста
            }}
          >
            WHY CHOOSE JOBCOMPASS?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            mt: 4,
          }}
        >
          <Card
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              minWidth: 250,
              position: "relative",
              padding: "20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7C3AED, #4A148C)",
              color: "white",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  margin: "0 auto 16px auto", // Центриране и отстъп отгоре
                }}
              >
                <CheckCircle sx={{ fontSize: 30, color: "#7C3AED" }} />
              </Box>
              <Typography variant="h5" align="center">
                Track Applications
              </Typography>
              <Typography variant="body2" align="center">
                Easily track the status of your job applications, from
                submission to interview, ensuring you never miss a step.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              minWidth: 250,
              position: "relative",
              padding: "20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7C3AED, #4A148C)",
              color: "white",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  margin: "0 auto 16px auto", // Центриране и отстъп отгоре
                }}
              >
                <BarChart sx={{ fontSize: 30, color: "#7C3AED" }} />
              </Box>
              <Typography variant="h5" align="center">
                Analytics
              </Typography>
              <Typography variant="body2" align="center">
                Gain insights into your job search performance, track your
                progress, and optimize your application strategy for success.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: { xs: "100%", sm: "45%", md: "30%" },
              minWidth: 250,
              position: "relative",
              padding: "20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7C3AED, #4A148C)",
              color: "white",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  margin: "0 auto 16px auto", // Центриране и отстъп отгоре
                }}
              >
                <Notifications sx={{ fontSize: 30, color: "#7C3AED" }} />
              </Box>
              <Typography variant="h5" align="center">
                Smart Reminders
              </Typography>
              <Typography variant="body2" align="center">
                Receive timely notifications for your job application deadlines,
                interviews, and follow-up reminders to stay ahead.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Purple Strip Above Footer */}
      <Box
        sx={{
          backgroundColor: "#7C3AED",
          color: "white",
          padding: "20px 0",
          display: "flex",
          justifyContent: "center",
          gap: 4,
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <CountUp end={10000} duration={2.5} separator="," />
          </Typography>
          <Typography variant="body2">Users</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <CountUp end={85000} duration={2.5} separator="," />
          </Typography>
          <Typography variant="body2">Applications Tracked</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <CountUp end={85} duration={2.5} suffix="%" />
          </Typography>
          <Typography variant="body2">Success Rate</Typography>
        </Box>
      </Box>

      {/* Footer Section */}
     
    </>
  );
};

export default LandingPage;
