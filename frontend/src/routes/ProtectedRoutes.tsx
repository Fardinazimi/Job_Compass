import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode; //The children can be any React (component, text svg (valid react))
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;
