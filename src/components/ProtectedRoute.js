import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../pages/Login/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
