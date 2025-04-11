// CalendarHeader.jsx
import React from "react";
import "./CalendarHeader.css";

const CalendarHeader = ({ selectedDate, onNavigate, view, onChangeView }) => {
  const formatLabel = (date) => {
    const options =
      view === "day"
        ? { day: "numeric", month: "long", year: "numeric" }
        : { month: "long", year: "numeric" };

    return date.toLocaleDateString("uk-UA", options);
  };

  return (
    <div className="calendar-header-bar">
      <div className="calendar-header-left">
        <button className="nav-arrow" onClick={() => onNavigate(-1)}>←</button>
        <div className="calendar-header-date">
          {formatLabel(selectedDate)}
        </div>
        <button className="nav-arrow" onClick={() => onNavigate(1)}>→</button>
      </div>

      <div className="calendar-view-tabs">
        <button
          className={`view-tab ${view === "day" ? "active" : ""}`}
          onClick={() => onChangeView("day")}
        >
          День
        </button>
        <button
          className={`view-tab ${view === "week" ? "active" : ""}`}
          onClick={() => onChangeView("week")}
        >
          Тиждень
        </button>
        <button
          className={`view-tab ${view === "month" ? "active" : ""}`}
          onClick={() => onChangeView("month")}
        >
          Місяць
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
