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
        <button className="add-button" onClick={handleAddTodayEvent}>Додати подію</button>
        <button className="expand-button" onClick={handleGoToFullCalendar}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 1H2.5C2.10218 1 1.72064 1.15804 1.43934 1.43934C1.15804 1.72064 1 2.10218 1 2.5V11.5C1 11.8978 1.15804 12.2794 1.43934 12.5607C1.72064 12.842 2.10218 13 2.5 13H11.5C11.8978 13 12.2794 12.842 12.5607 12.5607C12.842 12.2794 13 11.8978 13 11.5V8.5M7 7L13 1M13 1V4.75M13 1H9.25" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

        </button>
      </div>
    </div>
  );
};

export default CalendarWithNotes;
