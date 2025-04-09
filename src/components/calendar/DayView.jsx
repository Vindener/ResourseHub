import React from "react";
import "./DayView.css";

const hours = Array.from({ length: 24 }, (_, i) => i);

const DayView = ({ date, events, onEdit }) => {
  const ymd = toYMD(date);
  const dayEvents = events.filter((ev) => isEventOnDate(ev, date));

  const eventsByHour = {};
  for (let ev of dayEvents) {
    const startH = parseInt(ev.start_time.split(":")[0], 10);
    if (!eventsByHour[startH]) eventsByHour[startH] = [];
    eventsByHour[startH].push(ev);
  }

  return (
    <div className="day-view-container">
      <h3>Події за {date.toLocaleDateString("uk-UA")}</h3>
      <div className="day-timeline">
        {hours.map((h) => {
          const label = `${String(h).padStart(2, "0")}:00`;
          const hourEvents = eventsByHour[h] || [];

          return (
            <div key={h} className="day-hour-row">
              <div className="day-hour-label">{label}</div>
              <div className="day-hour-content">
                {hourEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="day-event-block"
                    onClick={() => onEdit && onEdit(ev)}
                  >
                    {ev.title} ({ev.start_time} - {ev.end_time})
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function isEventOnDate(ev, dateObj) {
  const ymd = toYMD(dateObj);
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

export default DayView;
