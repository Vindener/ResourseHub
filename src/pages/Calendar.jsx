import React, { useState, useEffect } from "react";
import axios from "axios";
import DayView from "../components/calendar/DayView";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";
import EventForm from "../components/Events/EventForm";
import "./Calendar.css";

const CalendarWithEvents = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/events?user_id=${user.id}`)
        .then((res) => {
          setAllEvents(res.data || []);
        })
        .catch((err) => console.error("Помилка отримання подій:", err));
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [allEvents, selectedDate, view]);

  const filterEvents = () => {
    setEvents(allEvents);
  };

  const changeView = (newView) => setView(newView);

  const handleNavigate = (direction) => {
    const newDate = new Date(selectedDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setSelectedDate(newDate);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    axios
      .get(`http://localhost:5000/events?user_id=${user.id}`)
      .then((res) => {
        setAllEvents(res.data || []);
      });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="calendar-root">
      {showForm ? (
        <EventForm
          date={selectedDate}
          event={editingEvent}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <div className="calendar-view-switch">
            <button className={view === "day" ? "active" : ""} onClick={() => changeView("day")}>День</button>
            <button className={view === "week" ? "active" : ""} onClick={() => changeView("week")}>Тиждень</button>
            <button className={view === "month" ? "active" : ""} onClick={() => changeView("month")}>Місяць</button>
          </div>

          <div className="calendar-header">
            <button onClick={() => handleNavigate(-1)}>⟵</button>
            <h2>
              {selectedDate.toLocaleString("uk-UA", {
                year: "numeric",
                month: "long",
                day: view === "day" ? "numeric" : undefined,
              })}
            </h2>
            <button onClick={() => handleNavigate(1)}>⟶</button>
          </div>

          <div className="calendar-add-event">
            <button onClick={handleAddEvent}>Додати подію</button>
          </div>

          {view === "day" && <DayView date={selectedDate} events={events} onEdit={handleEditEvent} />}
          {view === "week" && <WeekView date={selectedDate} events={events} onEdit={handleEditEvent} />}
          {view === "month" && <MonthView date={selectedDate} events={events} onEdit={handleEditEvent} />}
        </>
      )}
    </div>
  );
};

export default CalendarWithEvents;