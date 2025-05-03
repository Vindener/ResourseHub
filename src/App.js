import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import PersonalAccount from "./components/PersonalAccount";
import Notes from "./components/Notes/Notes";
import TimeManagementTips from "./components/TimeManagementTips";
import RelaxationPage from "./components/RelaxationPage";
import PomodoroTimer from "./components/PomodoroTimer";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Tamagotchi from "./pages/Tamagotchi/TamagotchiPage";

import HomePage from "./pages/HomePage";
import Calendar from "./pages/Calendar";
import AddEvent from "./components/Events/EventForm";
import DayViewWrapper from "./components/calendar/DayViewWrapper";
import EventEditPage from "./components/Events/EventEditPage";
import NewEventPage from "./components/Events/NewEventPage";


import Header  from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";



const AppContent = () => {
// Якщо ми на сторінці входу, додаємо фон
  const location = useLocation(); // Отримуємо поточний маршрут

  const isLoginPage = location.pathname === "/login"||location.pathname === "/register";
return (
      <div style={{ 
            marginLeft: isLoginPage ? "0" : "230px", 
            // marginTop:  "40px", 
            padding: isLoginPage ? "0" :"10px", 
            width: isLoginPage ? "100%" : "83%", 
            background: isLoginPage
              ? 'url(/images/backgroundImage.png) center center / cover no-repeat rgb(0 0 0)'
              : "#121212",
            backgroundColor: isLoginPage ? "#121212" : "#fffaf0", // fallback
            display: isLoginPage ? "flex":"block",
            alignItems: isLoginPage ? "center":"",
            justifyContent:isLoginPage ?  "center":""
          }}
          className="app-container"
      >
        <Header /> 

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/calendar" element={<Calendar />} />
          <Route path="/calendar/new" element={<AddEvent />} />
          <Route path="/calendar/day/:date" element={<DayViewWrapper />} />
          <Route path="/calendar/edit/:id" element={<EventEditPage />} />
          <Route path="/calendar/new" element={<NewEventPage />} />

          <Route path="/notes" element={<Notes />} />
          <Route path="/account" element={<PersonalAccount />} />
          <Route path="/tips" element={<TimeManagementTips />} />
          <Route path="/relaxation" element={<RelaxationPage />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />

          <Route path="/tamagotchi" element={<Tamagotchi />} />

          <Route
            path="*"
            element={<div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}><h1>Сторінку не знайдено! (Помилка 404)</h1></div>} // Для неправильних шляхів
          />
        </Routes>
      </div>
  );
}

function App() {
  
  return(
     <Router>
      <AppContent/>
    </Router>
  )
}

export default App;
