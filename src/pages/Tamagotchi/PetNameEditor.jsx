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
    <div className="pet-name-container">
      {!editing ? (
        <>
          <span className="pet-name-editor name-display">{name}</span>
          {isEditable && (
            <button className="pet-name-editor edit-btn" onClick={() => setEditing(true)}>✏️</button>
          )}
        </>
      ) : (
        <>
          <input
            className="name-input pet-name-editor"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={16}
          />
          <button className="pet-name-editor save-btn" onClick={handleSave}>✅</button>
        </>
      )}
    </div>
  );
};

export default PetNameEditor;
