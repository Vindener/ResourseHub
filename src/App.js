import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PersonalAccount from "./components/PersonalAccount";
import Notes from "./components/Notes";
import CalendarWithNotes from "./components/CalendarWithNotes";
import TimeManagementTips from "./components/TimeManagementTips";
import Navigation from "./components/Navigation"; 
import RelaxationPage from "./components/RelaxationPage";
import PomodoroTimer from "./components/PomodoroTimer";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<CalendarWithNotes />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/account" element={<PersonalAccount />} />
        <Route path="/tips" element={<TimeManagementTips />} />
        <Route path="/relaxation" element={<RelaxationPage />} />
        <Route path="/pomodoro" element={<PomodoroTimer />} />
      </Routes>
    </Router>
  );
}

export default App;
