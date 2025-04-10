// AddNoteModal.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles.css";

const AddNoteModal = ({ isOpen, onClose, user, onNoteAdded }) => {
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const modalRef = useRef(null);

  // Закриття модального вікна при кліку поза його межами
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const addNote = async () => {
    if (!newNote.content.trim()) {
      alert("Текст нотатки не може бути порожнім!");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/notes`, {
        title: newNote.title.trim() || "",
        content: newNote.content.trim(),
        user_id: user.id,
      });
      onNoteAdded(); // Оновлюємо список нотаток
      setNewNote({ title: "", content: "" });
      onClose();
    } catch (error) {
      console.error("Помилка при додаванні нотатки:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <input
          type="text"
          className="modal-input-header"
          placeholder="Назва..."
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          className="modal-input"
          placeholder="Почніть введення..."
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        ></textarea>
        <button className="save-btn" onClick={addNote}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V8L16 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21ZM7 5H11V7H13V5H15V9H7V5ZM7 13H17V19H7V13Z"
              fill="#24418A"
            />
          </svg>
          Зберегти
        </button>
        <button className="save-btn" onClick={onClose}>
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default AddNoteModal;
