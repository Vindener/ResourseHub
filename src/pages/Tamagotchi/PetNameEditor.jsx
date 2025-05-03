import React, { useState } from "react";
import "./PetNameEditor.css";

const PetNameEditor = ({ name, isEditable = false, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    if (newName.trim().length < 2) {
      alert("Ім’я має бути не коротше 2 символів");
      return;
    }
    onSave(newName.trim());
    setEditing(false);
  };

  return (
    <div className="pet-name-editor">
      {!editing ? (
        <>
          <span className="name-display">{name}</span>
          {isEditable && (
            <button className="edit-btn" onClick={() => setEditing(true)}>✏️</button>
          )}
        </>
      ) : (
        <>
          <input
            className="name-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={16}
          />
          <button className="save-btn" onClick={handleSave}>✅</button>
        </>
      )}
    </div>
  );
};

export default PetNameEditor;
