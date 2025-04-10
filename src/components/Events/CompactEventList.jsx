import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompactEventList.css"; // стилі, якщо є

const icons = {
  1: "📁",
  2: "📅",
  3: "💬",
  4: "➕",
};

const CompactEventList = ({ title = "Події на цей день" }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const toYMD = (d) => {
    const date = new Date(d);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    const today = toYMD(new Date());

    axios
      .get(`http://localhost:5000/events?user_id=${user.id}&date=${today}`)
      .then((res) => {
        const events = Array.isArray(res.data) ? res.data : [];
        setEvents(events);
      })
      .catch((err) => {
        console.error("❌ Помилка завантаження подій:", err);
        setEvents([]);
      });
  }, []);

  const sortedEvents = [...events].sort((a, b) =>
    a.start_time?.localeCompare?.(b.start_time)
  );

  return (
    <div className="compact-event-list">
      <h3>{title}</h3>
      {sortedEvents.length === 0 ? (
        <p className="no-events">Немає подій</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Час</th>
              <th>Подія</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((ev) => (
              <tr key={ev.id} onClick={() => navigate(`/calendar/edit/${ev.id}`)}>
                <td>{ev.start_time?.slice(0, 5)}</td>
                <td>
                  <span className="event-chip">
                    <span className="event-icon">
                      {icons[ev.icon_id] || "📌"}
                    </span>{" "}
                    {ev.title}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompactEventList;
