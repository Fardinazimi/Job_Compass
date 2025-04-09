import { ThemeContextProvider } from "./state/ThemeContext";
import Navbar from "./components/NavBar";
import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignInPage from "./components/SignInPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import HomePage from "./components/HomePage.tsx";
import AnalyticsPage from "./components/AnalyticsPage";
import SettingsPage from "./components/SettingsPage";
import Footer from "./components/Footer";
import InfoPage from "./components/InfoPage";
import Layout from "./components/Layout"; // ✅ Добавено
import "./App.css";

const App = () => {
  return (
    <ThemeContextProvider>
      <Navbar />
      <Layout>
        {" "}
        {/* ✅ Всички страници вече използват Layout */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={<Navigate to="/auth/signin" replace />}
          />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route
            path="home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
      </Layout>
      <Footer />
    </ThemeContextProvider>
  );
};

export default App;
