import React, { useState } from "react";

const CalendarWithNotes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalNote, setModalNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "", resources: "" });
  const today = new Date();

  const daysOfWeek = ["П", "В", "С", "Ч", "П", "С", "Н"];
  
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const handleNavigate = (direction) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1));
  };

  const handleSelectToday = () => {
    setSelectedDate(new Date());
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setModalNote({ date: clickedDate.toLocaleDateString("uk-UA"), title: "Нотатка", description: "Опис нотатки", resources: "5" });
  };

  const handleEditNote = () => {
    setModalNote(editingNote);
    setEditingNote(null);
  };

  const handleAddNote = () => {
    setModalNote(newNote);
    setShowAddNoteModal(false);
    setNewNote({ title: "", description: "", resources: "" });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <button onClick={() => handleNavigate(-1)}>⟵</button>
        <strong style={{ margin: "0 15px", fontSize: "1.2em" }}>
          {selectedDate.toLocaleString("uk-UA", { month: "long", year: "numeric" })}
        </strong>
        <button onClick={() => handleNavigate(1)}>⟶</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginTop: "10px" }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ fontWeight: "bold" }}>{day}</div>
        ))}
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={"empty-" + i}></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === selectedDate.getMonth() &&
            today.getFullYear() === selectedDate.getFullYear();
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              style={{
                padding: "10px",
                borderRadius: "4px",
                textAlign: "center",
                backgroundColor: isToday ? "blue" : "white",
                color: isToday ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
      <button onClick={() => handleDayClick(today.getDate())} style={{ marginLeft: "10px", padding: "5px 10px" }}>
        Додати подію
      </button>
      <button onClick={handleSelectToday} style={{ marginTop: "10px", padding: "5px 10px" }}>
        Вибрати поточний день
      </button>

      
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

      {modalNote && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000 }}>
          <h3>{modalNote.title}</h3>
          <p>{modalNote.description}</p>
          <p>Дата: {modalNote.date}</p>
          <p>Ресурси: {modalNote.resources}</p>
          <button onClick={() => setModalNote(null)}>Закрити</button>
          <button onClick={() => setEditingNote(modalNote)}>Редагувати</button>
        </div>
      )}

      {editingNote && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", zIndex: 1000 }}>
          <h3>Редагувати нотатку</h3>
          <input type="text" value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} placeholder="Назва" />
          <textarea value={editingNote.description} onChange={(e) => setEditingNote({ ...editingNote, description: e.target.value })} placeholder="Опис"></textarea>
          <input type="number" value={editingNote.resources} onChange={(e) => setEditingNote({ ...editingNote, resources: Number(e.target.value) })} placeholder="Ресурси" />
          <button onClick={handleEditNote}>Зберегти</button>
          <button onClick={() => setEditingNote(null)}>Скасувати</button>
        </div>
      )}
    </div>
  );
};

export default CalendarWithNotes;
