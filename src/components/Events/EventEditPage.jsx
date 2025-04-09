// EventEditPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EventForm from "./EventForm";

const EventEditPage = () => {
  const { id } = useParams(); // подія id з URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    axios
      .get(`http://localhost:5000/events?user_id=${user.id}`)
      .then((res) => {
        const all = res.data || [];
        const found = all.find((ev) => ev.id.toString() === id);
        if (found) setEvent(found);
        else navigate("/calendar"); // якщо не знайдено — назад
      })
      .catch((err) => {
        console.error("Помилка завантаження події:", err);
        navigate("/calendar");
      });
  }, [id, navigate]);

  const handleSave = () => {
    navigate("/calendar");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Редагування події</h2>
      {event ? (
        <EventForm event={event} onSave={handleSave} onCancel={() => navigate(-1)} />
      ) : (
        <p>Завантаження...</p>
      )}
    </div>
  );
};

export default EventEditPage;
