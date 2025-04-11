import React, { useState, useEffect } from "react";
import axios from "axios";
import DayView from "../components/calendar/DayView";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";
import EventForm from "../components/Events/EventForm";
import "./Calendar.css";
import PlanList from "../components/Plan/PlanList";
import CompactEventList from "../components/Events/CompactEventList";
import CalendarHeader from "./CalendarHeader";

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
        .then((res) => setAllEvents(res.data || []))
        .catch((err) => console.error("Помилка отримання подій:", err));
    }
  }, [user]);

  useEffect(() => {
    setEvents(allEvents);
  }, [allEvents, selectedDate, view]);

  const changeView = (newView) => setView(newView);

  const handleNavigate = (direction) => {
    const newDate = new Date(selectedDate);
    if (view === "month") newDate.setMonth(newDate.getMonth() + direction);
    else if (view === "week") newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setDate(newDate.getDate() + direction);
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
      .then((res) => setAllEvents(res.data || []));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const formatDateTitle = (date) =>
    date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="calendar-page">
  <CalendarHeader
    selectedDate={selectedDate}
    onNavigate={handleNavigate}
    view={view}
    onChangeView={changeView}
  />

  <div className="calendar-layout">
    <div className="calendar-left">
  <div className="calendar-root">
    {/* {view === "day" && (
      <div className="calendar-date-title">
        <h2>{formatDateTitle(selectedDate)}</h2>
      </div>
    )} */}

    {showForm ? (
      <EventForm
        date={selectedDate}
        event={editingEvent}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    ) : (
      <>
        {view === "day" && <DayView date={selectedDate} events={events} onEdit={handleEditEvent} />}
        {view === "week" && <WeekView date={selectedDate} events={events} onEdit={handleEditEvent} />}
        {view === "month" && <MonthView date={selectedDate} events={events} onEdit={handleEditEvent} />}
      </>
    )}
  </div>

  <div className="calendar-below">
    <div className="calendar-add-event">
      <button onClick={handleAddEvent}>Додати подію
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.92105 18.4211C8.92105 18.8398 9.08741 19.2414 9.38352 19.5375C9.67963 19.8336 10.0812 20 10.5 20C10.9188 20 11.3204 19.8336 11.6165 19.5375C11.9126 19.2414 12.0789 18.8398 12.0789 18.4211V11.5789H18.9211C19.3398 11.5789 19.7414 11.4126 20.0375 11.1165C20.3336 10.8204 20.5 10.4188 20.5 10C20.5 9.58124 20.3336 9.17963 20.0375 8.88352C19.7414 8.58741 19.3398 8.42105 18.9211 8.42105H12.0789V1.57895C12.0789 1.16018 11.9126 0.758573 11.6165 0.462463C11.3204 0.166353 10.9188 0 10.5 0C10.0812 0 9.67963 0.166353 9.38352 0.462463C9.08741 0.758573 8.92105 1.16018 8.92105 1.57895V8.42105H2.07895C1.66018 8.42105 1.25857 8.58741 0.962463 8.88352C0.666353 9.17963 0.5 9.58124 0.5 10C0.5 10.4188 0.666353 10.8204 0.962463 11.1165C1.25857 11.4126 1.66018 11.5789 2.07895 11.5789H8.92105V18.4211Z" fill="#FAF4E4" />
        </svg>
      </button>
    </div>

    <div className="compact-event-calendar">
      <CompactEventList title="Події на сьогодні" />
    </div>
  </div>
</div>


    <div className="calendar-sidebar">
      <PlanList />
    </div>
  </div>
</div>

  );
};

export default CalendarWithEvents;
