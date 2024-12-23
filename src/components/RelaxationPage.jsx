import React, { useState } from "react";

const RelaxationPage = () => {
  const [relaxationIdeas, setRelaxationIdeas] = useState([
    { id: 1, category: "Фізичний відпочинок", idea: "Прогулянка на природі або йога." },
    { id: 2, category: "Розумовий відпочинок", idea: "Читання книги або перегляд фільму." },
    { id: 3, category: "Соціальний відпочинок", idea: "Зустріч з друзями або сімейний вечір." },
  ]);

  const [newIdea, setNewIdea] = useState({ category: "", idea: "" });
  const [editingIdea, setEditingIdea] = useState(null);

  // Додавання ідеї
  const addIdea = () => {
    if (newIdea.category && newIdea.idea) {
      setRelaxationIdeas([
        ...relaxationIdeas,
        { id: Date.now(), category: newIdea.category, idea: newIdea.idea },
      ]);
      setNewIdea({ category: "", idea: "" });
    } else {
      alert("Будь ласка, заповніть всі поля.");
    }
  };

  // Видалення ідеї
  const deleteIdea = (id) => {
    setRelaxationIdeas(relaxationIdeas.filter((idea) => idea.id !== id));
  };

  // Початок редагування
  const startEditing = (idea) => {
    setEditingIdea(idea);
  };

  // Збереження редагування
  const saveEditing = () => {
    setRelaxationIdeas(
      relaxationIdeas.map((idea) =>
        idea.id === editingIdea.id ? editingIdea : idea
      )
    );
    setEditingIdea(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Рекомендації для відпочинку</h1>

      {/* Список існуючих ідей */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {relaxationIdeas.map((idea) => (
          <li key={idea.id} style={{ marginBottom: "15px" }}>
            <strong>{idea.category}:</strong> {idea.idea}
            <button
              onClick={() => startEditing(idea)}
              style={{ marginLeft: "10px" }}
            >
              Редагувати
            </button>
            <button
              onClick={() => deleteIdea(idea.id)}
              style={{ marginLeft: "10px" }}
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>

      {/* Форма додавання нової ідеї */}
      <h3>Додати нову ідею</h3>
      <label>
        Категорія:
        <input
          type="text"
          value={newIdea.category}
          onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        />
      </label>
      <br />
      <label>
        Ідея:
        <input
          type="text"
          value={newIdea.idea}
          onChange={(e) => setNewIdea({ ...newIdea, idea: e.target.value })}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        />
      </label>
      <br />
      <button onClick={addIdea}>Додати</button>

      {/* Модальне вікно для редагування */}
      {editingIdea && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <h3>Редагування ідеї</h3>
          <label>
            Категорія:
            <input
              type="text"
              value={editingIdea.category}
              onChange={(e) =>
                setEditingIdea({ ...editingIdea, category: e.target.value })
              }
              style={{ marginLeft: "10px", marginBottom: "10px" }}
            />
          </label>
          <br />
          <label>
            Ідея:
            <input
              type="text"
              value={editingIdea.idea}
              onChange={(e) =>
                setEditingIdea({ ...editingIdea, idea: e.target.value })
              }
              style={{ marginLeft: "10px", marginBottom: "10px" }}
            />
          </label>
          <br />
          <button onClick={saveEditing} style={{ marginRight: "10px" }}>
            Зберегти
          </button>
          <button onClick={() => setEditingIdea(null)}>Скасувати</button>
        </div>
      )}
    </div>
  );
};

export default RelaxationPage;
