import React, { useEffect, useState } from "react";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedHashtags, setEditedHashtags] = useState("");
  const [filterHashtag, setFilterHashtag] = useState("");

  useEffect(() => {
    // Завантаження нотаток з JSON-файлу
    fetch("/notes.json")
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error("Error loading notes:", error));
  }, []);

  const handleDelete = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setEditedContent(note.content);
    setEditedHashtags(note.hashtags.join(", "));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === editingNote.id
          ? { ...note, content: editedContent, hashtags: editedHashtags.split(",").map((tag) => tag.trim()) }
          : note
      )
    );
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const filteredNotes = filterHashtag
    ? notes.filter((note) => note.hashtags.includes(filterHashtag))
    : notes;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Нотатник</h1>

      {/* Сортування за хештегами */}
      <div style={{ marginBottom: "20px" }}>
        <label>Фільтрувати за хештегом: </label>
        <select
          value={filterHashtag}
          onChange={(e) => setFilterHashtag(e.target.value)}
        >
          <option value="">Усі</option>
          {[...new Set(notes.flatMap((note) => note.hashtags))].map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Список нотаток */}
      {filteredNotes.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredNotes.map((note) => (
            <li
              key={note.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "10px",
                position: "relative",
              }}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <p>
                <strong>Хештеги:</strong> {note.hashtags.join(", ")}
              </p>
              <button
                onClick={() => handleEdit(note)}
                style={{ marginRight: "10px" }}
              >
                Редагувати
              </button>
              <button onClick={() => handleDelete(note.id)}>Видалити</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Немає нотаток з цим хештегом...</p>
      )}

      {/* Модальне вікно */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2>Редагувати нотатку</h2>
          <textarea
            rows="5"
            style={{ width: "100%", marginBottom: "10px" }}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <input
            type="text"
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Хештеги (через кому)"
            value={editedHashtags}
            onChange={(e) => setEditedHashtags(e.target.value)}
          />
          <div>
            <button onClick={handleSave} style={{ marginRight: "10px" }}>
              Зберегти
            </button>
            <button onClick={closeModal}>Скасувати</button>
          </div>
        </div>
      )}

      {/* Фон модального вікна */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default Notes;
