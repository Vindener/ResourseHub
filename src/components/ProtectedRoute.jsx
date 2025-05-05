import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(undefined); // undefined == ще не перевірено

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // Ще чекаємо на результат useEffect
  if (user === undefined) {
    return null; // або спіннер
  }

  if (!user) {
    if (location.pathname === "/") {
      return <Navigate to="/landing" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Користувач авторизований
  return children;
};

export default ProtectedRoute;
