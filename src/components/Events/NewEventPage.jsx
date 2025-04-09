// NewEventPage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EventForm from "./EventForm";

const NewEventPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSave = () => {
    navigate("/calendar");
  };

const handleCancel = () => {
  const params = new URLSearchParams(location.search);
  const date = params.get("date");

  console.log("🧭 handleCancel:");
  console.log("URLSearchParams date:", date);
  console.log("location.state?.from:", location.state?.from);

  if (date) {
    console.log("➡️ Navigating to:", `/calendar/day/${date}`);
    navigate(`/calendar/day/${date}`);
  } else if (location.state?.from) {
    console.log("➡️ Navigating to state.from:", location.state.from);
    navigate(location.state.from);
  } else {
    console.log("➡️ Navigating to fallback: /calendar/home");
    navigate("/calendar/home");
  }
};




  return (
    <div style={{ padding: 20 }}>
      <h2>Нова подія</h2>
        <EventForm event={null} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default NewEventPage;