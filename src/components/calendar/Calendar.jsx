import React, { useState } from "react";
import "./Calendar.css";
import WeeklyCalendar from "./WeeklyCalendar";
import AddEventPage from "../Events/AddEventPage";

const CalendarWithNotes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState({
    "2025-02-23": [
      { time: "08:00", title: "Почистити зуби" },
      { time: "10:00", title: "Зустріч з другом" },
      { time: "12:00", title: "Піти в магазин" },
      { time: "14:00", title: "Прочитати книгу" },
      { time: "16:00", title: "Додаткове завдання" },
    ],
  });

  const daysOfWeek = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Неділя"];
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const handleNavigate = (direction) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1));
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const formattedDate = clickedDate.toISOString().split("T")[0];
    setSelectedDate(clickedDate);
    setSelectedEvents(events[formattedDate] || []);
  };

  const handleAddEvent = () => {
    const eventTitle = prompt("Введіть назву події:");
    const eventTime = prompt("Введіть час події (наприклад, 10:00):");
    if (!eventTitle || !eventTime) return;
    
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const newEvent = { time: eventTime, title: eventTitle };
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: [...(prevEvents[formattedDate] || []), newEvent],
    }));
    setSelectedEvents([...selectedEvents, newEvent]);
  };

  const handleEditEvent = (index) => {
    const updatedTitle = prompt("Редагуйте назву події:", selectedEvents[index].title);
    const updatedTime = prompt("Редагуйте час події:", selectedEvents[index].time);
    if (!updatedTitle || !updatedTime) return;
    
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const updatedEvents = [...selectedEvents];
    updatedEvents[index] = { time: updatedTime, title: updatedTitle };
    
    setEvents((prevEvents) => ({
      ...prevEvents,
      [formattedDate]: updatedEvents,
    }));
    setSelectedEvents(updatedEvents);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleNavigate(-1)}>⟵</button>
        <span>{selectedDate.toLocaleString("uk-UA", { month: "long", year: "numeric" })}</span>
        <button onClick={() => handleNavigate(1)}>⟶</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={"empty-" + i} className="calendar-day empty"></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
          const formattedDate = clickedDate.toISOString().split("T")[0];
          const dayEvents = events[formattedDate] || [];
          const isSelected = selectedDate.getDate() === day;

          return (
            <div key={day} className={`calendar-day ${isSelected ? "selected" : ""}`} onClick={() => handleDayClick(day)}>
              <span className="day-number">{day}</span>
              {dayEvents.slice(0, 4).map((event, index) => (
                <div key={index} className="event-time">{event.time}</div>
              ))}
              {dayEvents.length > 4 && <div className="more-events">...</div>}
            </div>
          );
        })}
      </div>
      <div className="event-details">
        <h3>Події на вибраний день</h3>
        {selectedEvents.length > 0 ? (
          <ul>
            {selectedEvents.map((event, index) => (
              <li key={index}>
                <strong>{event.time}</strong> - {event.title} 
                <button onClick={() => handleEditEvent(index)}>Редагувати</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Немає подій</p>
        )}
      </div>
      <div className="event-actions">
        <button onClick={handleAddEvent}>Додати подію</button>
      </div>

      <WeeklyCalendar/>

      <AddEventPage/>
    </div>
  );
};

export default CalendarWithNotes;
