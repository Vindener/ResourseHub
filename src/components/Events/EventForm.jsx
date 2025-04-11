import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./EventForm.css";

const defaultForm = {
  title: "",
  start_time: "",
  end_time: "",
  resource: "",
  icon_id: "",
  recurrence: "once",
};

const EventForm = ({ event = null, onSave, onCancel }) => {
  const [spoonsAvailable, setSpoonsAvailable] = useState(null);
  const [totalUsedToday, setTotalUsedToday] = useState(0);
  const [allowOverLimit, setAllowOverLimit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get("date");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // обнуляємо час

  const [form, setForm] = useState(defaultForm);
  const [currentDate, setCurrentDate] = useState(
    dateParam ? new Date(dateParam) : new Date()
  );

  useEffect(() => {
    if (event) {
      setForm({ ...event });
      setCurrentDate(new Date(event.event_date));
    } else {
      setForm({ ...defaultForm });
    }
  }, [event]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => {
    const updated = { ...prev, [name]: value };

    if (name === "start_time") {
      const [hours, minutes] = value.split(":").map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes);

      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 год

      const formattedEnd = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

      // Якщо end_time не вказано або <= start_time, оновлюємо
      if (!prev.end_time || prev.end_time <= value) {
        updated.end_time = formattedEnd;
      }
    }

    return updated;
  });
};


  const formatDateForSQL = (jsDate) => {
  const d = new Date(jsDate);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.start_time && form.end_time && form.end_time <= form.start_time) {
      alert("⛔ Час завершення має бути пізніше за час початку.");
      return;
    }

    if (currentDate < today) {
      alert("⛔ Неможливо створити подію в минулому");
      return;
    }

    if (!allowOverLimit && form.resource) {
    const resourceInt = parseInt(form.resource);
    const usedPlusNew = totalUsedToday + resourceInt;

    if (spoonsAvailable !== null && usedPlusNew > spoonsAvailable) {
      const confirm = window.confirm(
        `⛔ Поточний ресурс (${usedPlusNew}) перевищує доступні ложки (${spoonsAvailable}).\n\nДодати подію все одно?`
      );
      if (!confirm) return;
      setAllowOverLimit(true); // щоб дозволити повторне збереження
    }
  }


    try {
      const payload = {
        ...form,
        event_date: formatDateForSQL(currentDate),
        user_id: JSON.parse(localStorage.getItem("user"))?.id,
      };

      if (event) {
        await axios.put(`http://localhost:5000/events/${event.id}`, payload);
      } else {
        await axios.post("http://localhost:5000/events", payload);
      }

      alert("Подію успішно збережено ✅");

      if (typeof onSave === "function") {
        onSave();
      } else {
        navigate("/calendar");
      }
    } catch (error) {
      console.error("Помилка збереження події:", error);
      alert("Не вдалося зберегти подію 😢");
    }
  };

  const handleCancelClick = () => {
    console.log("🚨 Клік по кнопці 'Скасувати'");
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      navigate("/");
    }
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    if (prev >= today) {
      setCurrentDate(prev);
    }
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const isPrevDisabled = currentDate <= today;

   useEffect(() => {
  const fetchSpoons = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/spoons/${user.id}`);
      setSpoonsAvailable(res.data.spoons);

      // Загальна кількість ресурсу в подіях на сьогодні
      const eventsRes = await axios.get(`http://localhost:5000/events?user_id=${user.id}`);
      const today = formatDateForSQL(currentDate);

      const totalUsed = eventsRes.data
        .filter((e) => {
          const eventDate = new Date(e.event_date);
          return formatDateForSQL(eventDate) === formatDateForSQL(currentDate);
        })
        .reduce((sum, ev) => sum + (parseInt(ev.resource) || 0), 0);


      setTotalUsedToday(totalUsed);
    } catch (error) {
      console.error("❌ Помилка завантаження ложок або подій:", error);
    }
  };

  fetchSpoons();
}, [currentDate]);

  return (
    <div className="event-form-container">
      <div className="event-form-date-nav">
        <button
          className="nav-btn"
          onClick={handlePrevDay}
          disabled={isPrevDisabled}
          title={isPrevDisabled ? "Неможливо створити подію в минулому" : ""}
          style={{
            opacity: isPrevDisabled ? 0.4 : 1,
            cursor: isPrevDisabled ? "not-allowed" : "pointer",
          }}
        >
          ←
        </button>

        <h3 className="event-form-date">
          {currentDate.toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button className="nav-btn" onClick={handleNextDay}>→</button>
      </div>

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Час початку події</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
          />

          <label>Час кінця події</label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <label>Назва події/Опис</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Введіть назву події або її короткий опис"
          required
        />

        <div className="form-row">
          <label>Ресурс на подію</label>
          <input
            type="number"
            name="resource"
            value={form.resource}
            onChange={handleChange}
          />
          {spoonsAvailable !== null && (
        <p style={{ marginTop: "4px", fontSize: "14px", color: totalUsedToday + Number(form.resource || 0) > spoonsAvailable ? "red" : "green" }}>
          Використано: {totalUsedToday}/{spoonsAvailable} ложок {form.resource && `+ ${form.resource}`}
        </p>
      )}


          <label>Іконка події</label>
          <select
            name="icon_id"
            value={form.icon_id}
            onChange={handleChange}
          >
            <option value="">Оберіть іконку для події</option>
            <option value="1">📁</option>
            <option value="2">📅</option>
            <option value="3">💬</option>
          </select>
        </div>

        <label>Повторюваність</label>
        <div className="form-row recurrence-row">
          <label>
            <input
              type="radio"
              name="recurrence"
              value="once"
              checked={form.recurrence === "once"}
              onChange={handleChange}
            />
            Один раз
          </label>
          <label>
            <input
              type="radio"
              name="recurrence"
              value="daily"
              checked={form.recurrence === "daily"}
              onChange={handleChange}
            />
            Кожен день
          </label>
          <label>
            <input
              type="radio"
              name="recurrence"
              value="weekly"
              checked={form.recurrence === "weekly"}
              onChange={handleChange}
            />
            Раз на тиждень
          </label>
          <label>
            <input
              type="radio"
              name="recurrence"
              value="month"
              checked={form.recurrence === "month"}
              onChange={handleChange}
            />
            Раз на місяць
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            {event ? "Зберегти зміни" : "Додати подію"}
          </button>
          {event && (
            <button
              type="button"
              className="delete-button"
              onClick={async () => {
                const confirmDelete = window.confirm("Ви впевнені, що хочете видалити цю подію?");
                if (confirmDelete) {
                  try {
                    await axios.delete(`http://localhost:5000/events/${event.id}`);
                    alert("Подія видалена");
                    if (typeof onSave === "function") {
                      onSave();
                    }
                    else{
                      navigate("/");
                    }

                  } catch (error) {
                    console.error("Помилка видалення події:", error);
                    alert("Не вдалося видалити подію");
                  }
                }
              }}
            >
              🗑️ Видалити подію
            </button>
          )}
          <button type="button" className="save-button" onClick={handleCancelClick}>
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
