// DayViewWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DayView from "./DayView";
import axios from "axios";
import "./DayView.css";

const DayViewWrapper = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const toYMD = (d) => {
    const date = new Date(d);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  const isEventOnDate = (ev, ymd) => {
    const evDate = toYMD(ev.event_date);
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
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      axios
        .get(`http://localhost:5000/events?user_id=${user.id}`)
        .then((res) => {
          const all = res.data || [];
          const filtered = all.filter((ev) => isEventOnDate(ev, date));
          setEvents(filtered);
        })
        .catch((err) => console.error("Помилка завантаження подій:", err));
    }
  }, [date]);

  const handleEdit = (ev) => {
    navigate(`/calendar/edit/${ev.id}`);
  };

  const handleAddEvent = () => {
    navigate(`/calendar/new?date=${date}`, {
    state: { from: `/calendar/day/${date}` },
    });

  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => navigate(-1)} className="add-event-button">← Назад</button>
        <button onClick={handleAddEvent} className="add-event-button">
          Додати подію
        </button>
      </div>
      <h2 style={{ marginTop: 10 }}>
        Події за {new Date(date).toLocaleDateString("uk-UA")}
      </h2>
      <DayView date={new Date(date)} events={events} onEdit={handleEdit} />
    </div>
  );
};

export default DayViewWrapper;
