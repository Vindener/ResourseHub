import React, { useState } from "react";
import "./WeeklyCalendar.css";

const WeeklyCalendar = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [events, setEvents] = useState({
    "2025-02-23": [
      { time: "08:00", title: "Поснідати" },
      { time: "10:00", title: "Піти на прогулянку" },
      { time: "15:00", title: "Почистити зуби" },
    ],
  });

  const daysOfWeek = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Неділя"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      return newDate;
    });
  };

  const weekDates = getWeekDates(selectedWeek);

  const handleAddEvent = (day, hour) => {
    const eventTitle = prompt("Введіть назву події:");
    if (!eventTitle) return;
    const newEvent = { time: hour, title: eventTitle };
    setEvents((prevEvents) => ({
      ...prevEvents,
      [day]: [...(prevEvents[day] || []), newEvent],
    }));
  };

  const handleEditEvent = (day, index) => {
    const updatedTitle = prompt("Редагуйте назву події:", events[day][index].title);
    if (!updatedTitle) return;
    const updatedEvents = [...events[day]];
    updatedEvents[index] = { ...updatedEvents[index], title: updatedTitle };
    setEvents({ ...events, [day]: updatedEvents });
  };

  return (
    <div className="weekly-calendar">
      <div className="week-navigation">
        <button onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() - 7)))}>
          ⟵ Попередній тиждень
        </button>
        <span>
          {weekDates[0].toISOString().split("T")[0]} - {weekDates[6].toISOString().split("T")[0]}
        </span>
        <button onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() + 7)))}>
          Наступний тиждень ⟶
        </button>
      </div>
      <div className="calendar-grid">
        <div className="hours-column">
          {hours.map((hour) => (
            <div key={hour} className="hour-cell">{hour}</div>
          ))}
        </div>
        {weekDates.map((date, dayIndex) => (
          <div key={date} className="day-column">
            <div className="day-header">
              {daysOfWeek[dayIndex]} <br /> {date.getDate()}
            </div>
            {hours.map((hour) => (
              <div key={hour} className="hour-cell" onClick={() => handleAddEvent(date.toISOString().split("T")[0], hour)}>
                {events[date.toISOString().split("T")[0]]?.map(
                  (event, index) =>
                    event.time === hour && (
                      <div key={index} className="event" onClick={() => handleEditEvent(date.toISOString().split("T")[0], index)}>
                        {event.title}
                      </div>
                    )
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
