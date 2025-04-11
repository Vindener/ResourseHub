// MonthView.jsx
import React from "react";
import "./MonthView.css";

function MonthView({ date, events, onEdit }) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayIndex = (() => {
    const tempDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return (tempDate.getDay() + 6) % 7;
  })();

  const daysOfWeek = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П’ятниця",
    "Субота",
    "Неділя",
  ];

  function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}


  return (
    <div className="month-view-container">
      <div className="days-of-week">
        {daysOfWeek.map((day) => (
          <div key={day} className="week-day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={"empty-" + i} className="calendar-day empty"></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const dayNum = i + 1;
          const thisDate = new Date(date.getFullYear(), date.getMonth(), dayNum);
          const ymd = toYMD(thisDate);

          const dayEvents = events.filter((ev) => isEventInDay(ev, ymd));

          return (
           <div
              key={dayNum}
              className={`calendar-day ${isToday(thisDate) ? "today" : ""}`}
            >

              <div className="day-number">{dayNum}</div>
              {dayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="calendar-event-marker"
                  onClick={() => onEdit && onEdit(ev)}
                >
                  {ev.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isEventInDay(ev, ymd) {
  const evDate = toYMD(new Date(ev.event_date));
  const recurrence = ev.recurrence || "once";

  if (recurrence === "once") return evDate === ymd;
  if (recurrence === "daily") return evDate <= ymd;

  if (recurrence === "weekly") {
    const evD = new Date(evDate);
    const currD = new Date(ymd);
    return evD.getDay() === currD.getDay() && evDate <= ymd;
  }

  if (recurrence === "month") {
    const evD = new Date(evDate);
    const currD = new Date(ymd);
    return evD.getDate() === currD.getDate() && evDate <= ymd;
  }

  return false;
}

function toYMD(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

export default MonthView;