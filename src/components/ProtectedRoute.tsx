import { Navigate } from "react-router-dom";
import authService from "../services/authService";

const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = authService.isAuthenticated();

  return isAuthenticated ? children : <Navigate to="/register" />;
};

export default ProtectedRoute;