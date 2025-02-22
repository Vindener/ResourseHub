import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PersonalAccount from "./components/PersonalAccount";
import Notes from "./components/Notes";
import TimeManagementTips from "./components/TimeManagementTips";
import RelaxationPage from "./components/RelaxationPage";
import PomodoroTimer from "./components/PomodoroTimer";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import HomePage from "./pages/HomePage";

import Header  from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header /> 
      <div style={{ marginLeft: "220px", marginTop: "60px", padding: "20px", width:"80%", backgroundColor:"var(--background-color)", }}>
        <Routes >
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/account" element={<PersonalAccount />} />
          <Route path="/tips" element={<TimeManagementTips />} />
          <Route path="/relaxation" element={<RelaxationPage />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />

          <Route
            path="*"
            element={<div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}><h1>Сторінку не знайдено! (Помилка 404)</h1></div>} // Для неправильних шляхів
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
