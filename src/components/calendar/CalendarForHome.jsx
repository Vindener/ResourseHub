import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CalendarHome.css";

const CalendarWithNotes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDayView, setShowDayView] = useState(false);
  const navigate = useNavigate();
  const today = new Date();

  const daysOfWeek = ["П", "В", "С", "Ч", "П", "С", "Н"];

  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const handleNavigate = (direction) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1));
  };

  const handleDayClick = (day) => {
    const clicked = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const ymd = clicked.toISOString().split("T")[0];
    navigate(`/calendar/day/${ymd}`);
  };


  const handleAddTodayEvent = () => {
    navigate("/calendar/new", {
  state: { from: "/calendar/home" },
});
  };

  const handleGoToFullCalendar = () => {
    navigate("/calendar");
  };

  return (
    <div className="calendar-home">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => handleNavigate(-1)}>←</button>
        <div className="month-label">
          {selectedDate.toLocaleString("uk-UA", { month: "long", year: "numeric" })}
        </div>
        <button className="nav-button" onClick={() => handleNavigate(1)}>→</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((day, i) => (
          <div key={i} className="day-name">{day}</div>
        ))}
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={"empty-" + i} className="day empty"></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === selectedDate.getMonth() &&
            today.getFullYear() === selectedDate.getFullYear();

          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === selectedDate.getMonth() &&
            selectedDate.getFullYear() === selectedDate.getFullYear();

          return (
            <div
              key={day}
              className={`day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

       <div className="calendar-actions">
        <button className="add-btn" onClick={handleAddTodayEvent}>Додати подію</button>
        <button className="go-btn" onClick={handleGoToFullCalendar}>↗️</button>
      </div>
    </div>
  );
};

export default CalendarWithNotes;
