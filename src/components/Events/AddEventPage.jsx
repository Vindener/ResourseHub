import React, { useState, useEffect } from "react";
import axios from "axios";

const AddEventPage = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [icon, setIcon] = useState("");
  const [resource, setResource] = useState("");
  const [recurrence, setRecurrence] = useState("once");
  const [eventDate, setEventDate] = useState("");
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setEventDate(adjustToLocalDate(new Date())); // Встановлення сьогоднішньої дати за замовчуванням
  }, []);

const adjustToLocalDate = (dateStr) => {
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Враховуємо часовий пояс
  return date.toISOString().split("T")[0]; // Отримуємо yyyy-mm-dd
};



  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/events?user_id=${user.id}&date=${adjustToLocalDate(new Date())}`)
        .then((response) => setEvents(response.data))
        .catch((error) => console.error("Помилка отримання подій:", error));
    }
  }, [user]);

 const changeDate = (days) => {
  const newDate = new Date(eventDate);
  newDate.setDate(newDate.getDate() + days);
  setEventDate(adjustToLocalDate(newDate));

  // Якщо редагується подія, оновлюємо її дату, але не чіпаємо інші поля
  if (selectedEvent) {
    setSelectedEvent({ ...selectedEvent, event_date: adjustToLocalDate(newDate) });
  }
};

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const user_id = user.id;
    const newEvent = { user_id, title, start_time: startTime, end_time: endTime, icon_id: icon, resource, recurrence, custom_recurrence: null, event_date: eventDate || adjustToLocalDate(new Date()) };

    if (selectedEvent) {
      axios.put(`http://localhost:5000/events/${selectedEvent.id}`, newEvent)
        .then(() => {
          alert("Подію оновлено!");
          resetForm();
          refreshEvents();
        })
        .catch(error => console.error("Помилка оновлення події:", error));
    } else {
      axios.post("http://localhost:5000/events", newEvent)
        .then(() => {
          alert("Подію додано!");
          resetForm();
          refreshEvents();
        })
        .catch(error => console.error("Помилка додавання події:", error));
    }
  };

   useEffect(() => {
    if (user?.id) {
      refreshEvents();
    }
  }, [user, eventDate]);

const refreshEvents = () => {
  axios
    .get(`http://localhost:5000/events?user_id=${user.id}`)
    .then((response) => {
      const allEvents = response.data;
      const filteredEvents = allEvents.filter((event) => {
        const eventDay = new Date(event.event_date).getDay(); // День тижня події (0 - неділя, 6 - субота)
        const selectedDay = new Date(eventDate).getDay(); // День тижня вибраної дати

        if (event.recurrence === "once") {
          return adjustToLocalDate(event.event_date) === eventDate; // Разова подія
        } else if (event.recurrence === "daily") {
          return true; // Відображати щодня
        } else if (event.recurrence === "weekly") {
          return eventDay === selectedDay; // Відображати в той самий день тижня
        }
        return false;
      });

      setEvents(filteredEvents);
    })
    .catch((error) => console.error("Помилка отримання подій:", error));
};

  const resetForm = () => {
    setTitle("");
    setStartTime("");
    setEndTime("");
    setIcon("");
    setResource("");
    setRecurrence("once");
    setEventDate(adjustToLocalDate(new Date())); // Скидання на сьогоднішню дату
    setSelectedEvent(null);
  };

const handleEdit = (event) => {
  setSelectedEvent(event);
  setTitle(event.title);
  setStartTime(event.start_time);
  setEndTime(event.end_time);
  setIcon(event.icon_id);
  setResource(event.resource);
  setRecurrence(event.recurrence);
  
  // Перетворюємо формат дати перед відображенням
  setEventDate(adjustToLocalDate(event.event_date));
};
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">

      {/* Перехід між днями */}
      <div className="flex items-center justify-center mb-3">
        <button onClick={() => changeDate(-1)} className="px-3 py-1 bg-gray-200 rounded">←</button>
        <span className="mx-4 font-bold">{eventDate}</span>
        <button onClick={() => changeDate(1)} className="px-3 py-1 bg-gray-200 rounded">→</button>
      </div>

      <h2 className="text-xl font-bold mb-4">{selectedEvent ? "Редагувати подію" : "Додати нову подію"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Назва події" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Іконка (ID)" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="number" placeholder="Ресурс (число)" value={resource} onChange={(e) => setResource(e.target.value)} className="w-full p-2 border rounded" required />
        <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="w-full p-2 border rounded">
          <option value="once">Один раз</option>
          <option value="daily">Кожен день</option>
          <option value="weekly">Раз на тиждень</option>
        </select>
        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{selectedEvent ? "Зберегти зміни" : "Додати"}</button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-4">Події</h2>
      {events.length === 0 ? (
        <p>Подій немає</p>
      ) : (
       <ul className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="p-2 border rounded cursor-pointer" onClick={() => handleEdit(event)}>
            <strong>{event.title}</strong> ({event.start_time} - {event.end_time})
            {event.recurrence === "daily" && " - кожен день"}
            {event.recurrence === "weekly" && " - щотижня"}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default AddEventPage;
