import { Navigate } from "react-router-dom";
import {  useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // якщо це головна сторінка – показуємо LandingPage замість редиректу
    if (location.pathname === "/") {
      return <Navigate to="/landing" replace />;
    }

    // інакше редирект на логін
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
