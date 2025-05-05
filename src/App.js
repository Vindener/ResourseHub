import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import PersonalAccount from "./pages/PersonalAccountPage.jsx";
import UserProfilePage from "./pages/Profile/UserProfilePage.jsx";
import UserSettingsPage from "./pages/Profile/UserSettingsPage.jsx";
import Notes from "./components/Notes/Notes";

import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import Tamagotchi from "./pages/Tamagotchi/TamagotchiPage";

import HomePage from "./pages/HomePage";
import Calendar from "./pages/Calendar";
import AddEvent from "./components/Events/EventForm";
import DayViewWrapper from "./components/calendar/DayViewWrapper";
import EventEditPage from "./components/Events/EventEditPage";
import NewEventPage from "./components/Events/NewEventPage";

import SelfHelpMain from "./pages/SelfHelp/SelfHelpMain";
import SelfHelpADHD from "./pages/SelfHelp/SelfHelpADHD";
import SelfHelpTimeMent from "./pages/SelfHelp/SelfHelpTimeMent";
import SelfHelpRelaxing from "./pages/SelfHelp/SelfHelpRelaxing";
import SelfHelpFocus from "./pages/SelfHelp/SelfHelpFocus";

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
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/calendar/new" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
          <Route path="/calendar/day/:date" element={<ProtectedRoute><DayViewWrapper /></ProtectedRoute>} />
          <Route path="/calendar/edit/:id" element={<ProtectedRoute><EventEditPage /></ProtectedRoute>} />
          <Route path="/calendar/new" element={<ProtectedRoute><NewEventPage /></ProtectedRoute>} />

          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/account-personal" element={<ProtectedRoute><PersonalAccount /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/account/settings" element={<ProtectedRoute><UserSettingsPage /></ProtectedRoute>} />

          <Route path="/selfhelp" element={<ProtectedRoute><SelfHelpMain /></ProtectedRoute>} />
          <Route path="/selfhelp/adhd" element={<ProtectedRoute><SelfHelpADHD /></ProtectedRoute>} />
          <Route path="/selfhelp/timemanagement" element={<ProtectedRoute><SelfHelpTimeMent /></ProtectedRoute>} />
          <Route path="/selfhelp/rest" element={<ProtectedRoute><SelfHelpRelaxing /></ProtectedRoute>} />
          <Route path="/selfhelp/focus" element={<ProtectedRoute><SelfHelpFocus /></ProtectedRoute>} />

          <Route path="/tamagotchi" element={<ProtectedRoute><Tamagotchi /></ProtectedRoute>} />

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
