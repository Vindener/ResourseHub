// CalendarWithNotes.jsx
import React, { useState, useEffect } from "react";
import notesData from "../data/notes.json"; // Завантаження даних нотаток

const CalendarWithNotes = () => {
  const [notes, setNotes] = useState([]); // Нотатки з файлу
  const [view, setView] = useState("month"); // Тип перегляду: місяць, тиждень, день
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalNote, setModalNote] = useState(null); // Нотатка для модального вікна
  const [editingNote, setEditingNote] = useState(null); // Нотатка для редагування
  const [showAddNoteModal, setShowAddNoteModal] = useState(false); // Додавання нотатки
  const [newNote, setNewNote] = useState({ title: "", description: "", resources: 0 });

  useEffect(() => {
    // Імітація завантаження даних з JSON
    setNotes(notesData);
  }, []);

  // Отримання нотаток для вибраного дня
  const getNotesForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return notes.filter((note) => note.date === dateString);
  };

  // Зміна перегляду (місяць, тиждень, день)
  const changeView = (newView) => setView(newView);

  // Перемикання місяців, тижнів, днів
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (view === "month") {
      newDate.setMonth(selectedDate.getMonth() + direction);
    } else if (view === "week") {
      newDate.setDate(selectedDate.getDate() + direction * 7);
    } else if (view === "day") {
      newDate.setDate(selectedDate.getDate() + direction);
    }
    setSelectedDate(newDate);
  };

  // Відображення нотаток для конкретної дати
  const renderDayNotes = (date) => {
    const dayNotes = getNotesForDate(date);
    return dayNotes.map((note) => (
      <div
        key={note.id}
        style={{ marginBottom: "5px", color: "blue", cursor: "pointer" }}
        onClick={() => setModalNote(note)}
      >
        <strong>{note.title}</strong> ({note.resources} ресурсів)
      </div>
    ));
  };

  // Генерація днів тижня
  const getDayName = (date) => {
    return date.toLocaleDateString("uk-UA", { weekday: "short" });
  };

  // Генерація перегляду місяця
  const renderMonthView = () => {
    const today = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
        {[...Array(daysInMonth)].map((_, index) => {
          const date = new Date(today.getFullYear(), today.getMonth(), index + 1);
          return (
            <div
              key={index}
              onClick={() => {
                if (getNotesForDate(date).length === 0) {
                  setShowAddNoteModal(true);
                  setSelectedDate(date);
                } else {
                  setSelectedDate(date);
                }
              }}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: getNotesForDate(date).length > 0 ? "#f0f8ff" : "#fff",
              }}
            >
              <div>{index + 1}</div>
              <div style={{ fontSize: "10px", color: "gray" }}>{getDayName(date)}</div>
              <div style={{ fontSize: "12px", marginTop: "5px" }}>{renderDayNotes(date)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Генерація перегляду тижня
  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
        {[...Array(7)].map((_, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          return (
            <div
              key={index}
              onClick={() => {
                if (getNotesForDate(date).length === 0) {
                  setShowAddNoteModal(true);
                  setSelectedDate(date);
                } else {
                  setSelectedDate(date);
                }
              }}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: getNotesForDate(date).length > 0 ? "#f0f8ff" : "#fff",
              }}
            >
              <div>{date.toDateString()}</div>
              <div style={{ fontSize: "12px", marginTop: "5px" }}>{renderDayNotes(date)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Генерація перегляду дня
  const renderDayView = () => {
    return (
      <div>
        <h3>{selectedDate.toDateString()}</h3>
        {renderDayNotes(selectedDate)}
        {getNotesForDate(selectedDate).length === 0 && (
          <button onClick={() => setShowAddNoteModal(true)}>Додати нотатку</button>
        )}
      </div>
    );
  };

  // Додавання нотатки
  const handleAddNote = () => {
    const dateString = selectedDate.toISOString().split("T")[0];
    const newNoteEntry = { ...newNote, date: dateString, id: Date.now() };
    setNotes([...notes, newNoteEntry]);
    setNewNote({ title: "", description: "", resources: 0 });
    setShowAddNoteModal(false);
  };

  // Редагування нотатки
  const handleEditNote = () => {
    setNotes(notes.map((note) => (note.id === editingNote.id ? editingNote : note)));
    setEditingNote(null);
    setModalNote(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => changeView("month")}>Місяць</button>
        <button onClick={() => changeView("week")}>Тиждень</button>
        <button onClick={() => changeView("day")}>День</button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => navigateDate(-1)}>⟵</button>
        <button onClick={() => navigateDate(1)}>⟶</button>
      </div>
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}

      {modalNote && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h3>{modalNote.title}</h3>
          <p>{modalNote.description}</p>
          <p>Дата: {modalNote.date}</p>
          <p>Ресурси: {modalNote.resources}</p>
          <button onClick={() => setModalNote(null)}>Закрити</button>
          <button onClick={() => setEditingNote(modalNote)}>Редагувати</button>
        </div>
      )}

      {editingNote && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h3>Редагувати нотатку</h3>
          <input
            type="text"
            value={editingNote.title}
            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
            placeholder="Назва"
          />
          <textarea
            value={editingNote.description}
            onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })}
            placeholder="Опис"
          ></textarea>
          <input
            type="number"
            value={editingNote.resources}
            onChange={(e) => setEditingNote({ ...editingNote, resources: Number(e.target.value) })}
            placeholder="Ресурси"
          />
          <button onClick={handleEditNote}>Зберегти</button>
          <button onClick={() => setEditingNote(null)}>Скасувати</button>
        </div>
      )}

      {showAddNoteModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h3>Додати нотатку</h3>
          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Назва"
          />
          <textarea
            value={newNote.description}
            onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
            placeholder="Опис"
          ></textarea>
          <input
            type="number"
            value={newNote.resources}
            onChange={(e) => setNewNote({ ...newNote, resources: Number(e.target.value) })}
            placeholder="Ресурси"
          />
          <button onClick={handleAddNote}>Додати</button>
          <button onClick={() => setShowAddNoteModal(false)}>Скасувати</button>
        </div>
      )}

      {(modalNote || showAddNoteModal || editingNote) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => {
            setModalNote(null);
            setShowAddNoteModal(false);
            setEditingNote(null);
          }}
        ></div>
      )}
    </div>
  );
};

export default CalendarWithNotes;
