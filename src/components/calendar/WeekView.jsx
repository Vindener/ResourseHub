import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeekView.css";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getStartOfWeek(date) {
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
  const monday = new Date(date);
  monday.setDate(monday.getDate() - (dayOfWeek - 1));
  return monday;
}

function toYMD(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

function isEventOnDate(ev, dateObj) {
  const ymd = toYMD(dateObj);
  const evDate = ev.normalized_date || toYMD(ev.event_date);
  const recurrence = ev.recurrence || "once";

  if (recurrence === "once") return evDate === ymd;
  if (recurrence === "daily") return ymd >= evDate;

  if (recurrence === "weekly") {
    const evD = new Date(evDate);
    const currD = new Date(ymd);
    const evWeekday = evD.getDay() === 0 ? 7 : evD.getDay();
    const currWeekday = currD.getDay() === 0 ? 7 : currD.getDay();
    return currWeekday === evWeekday && ymd >= evDate;
  }

  return false;
}

const WeekView = ({ date, onEdit }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const startOfWeek = getStartOfWeek(date);

  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return {
      date: d,
      ymd: toYMD(d),
      label: d.toLocaleDateString("uk-UA", { weekday: "long" }),
      dateNumber: d.getDate(),
    };
  });

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/events?user_id=${user.id}`)
        .then((res) => {
          const all = res.data || [];
          const normalizedEvents = all.map((ev) => ({
            ...ev,
            normalized_date: toYMD(new Date(ev.event_date)),
            recurrence: ev.recurrence || "once",
          }));
          setEvents(normalizedEvents);
        })
        .catch((err) => console.error("Помилка отримання подій:", err));
    }
  }, [user]);

  return (
    <div className="week-view-container">
      <div className="weekly-timeline-header">
        <div className="cell hour-label">Година</div>
        {daysArray.map((day, i) => (
          <div className="cell day-header" key={i}>
            <div className="week-day-number">{day.dateNumber}</div>
            <div className="week-day-name">{day.label}</div>
          </div>
        ))}
      </div>

      <div className="weekly-timeline-body">
        {HOURS.map((hour) => {
          const hourLabel = `${String(hour).padStart(2, "0")}:00`;
          return (
            <div className="weekly-timeline-row" key={hour}>
              <div className="cell hour-cell">{hourLabel}</div>
              {daysArray.map((day, idx) => {
                const dayEvents = events.filter((ev) => {
                  const evHour = parseInt(ev.start_time?.split(":" )[0], 10);
                  return isEventOnDate(ev, day.date) && evHour === hour;
                });
                return (
                  <div className="cell day-hour-cell" key={idx}>
                    {dayEvents.map((ev) => (
                      <div
                        className="event-block"
                        key={`${ev.id}-${day.ymd}`}
                        onClick={() => onEdit && onEdit(ev)}
                      >
                        <span className="event-title">{ev.title}</span>
                        <br />
                        <span className="event-time">
                          {ev.start_time.slice(0, 5)} - {ev.end_time.slice(0, 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
