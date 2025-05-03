import React, { useState } from "react";

const PersonalAccount = () => {
  const [user, setUser] = useState({
    fullName: "Іваненко Іван Іванович",
    age: 25,
    gender: "чоловік",
    spoons: 0,
  });

  const [customSpoons, setCustomSpoons] = useState("");

  // Формула розрахунку ресурсів (ложок)
  const calculateDefaultSpoons = (user) => {
    let base = 10 + user.age / 10;
    if (user.gender === "жінка") {
      base -= 1;
    }
    return Math.round(base);
  };

  // Ініціалізація ресурсу
  if (user.spoons === 0) {
    setUser((prev) => ({ ...prev, spoons: calculateDefaultSpoons(prev) }));
  }

  const handleSpoonsChange = (e) => {
    setCustomSpoons(e.target.value);
  };

  const handleSave = () => {
    if (customSpoons && !isNaN(customSpoons)) {
      setUser((prev) => ({ ...prev, spoons: parseInt(customSpoons, 10) }));
      setCustomSpoons("");
    } else {
      alert("Введіть коректну кількість ложок.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Особистий кабінет</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>ПІБ:</strong> {user.fullName}
        </p>
        <p>
          <strong>Вік:</strong> {user.age}
        </p>
        <p>
          <strong>Стать:</strong> {user.gender}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Ресурс (система ложок)</h3>
        <p>
          <strong>Поточний ресурс:</strong> {user.spoons} ложок
        </p>
        <label>
          Встановити кількість ложок:
          <input
            type="number"
            value={customSpoons}
            onChange={handleSpoonsChange}
            style={{ marginLeft: "10px", width: "60px" }}
          />
        </label>
        <button onClick={handleSave} style={{ marginLeft: "10px" }}>
          Зберегти
        </button>
      </div>
    </div>
  );
};

export default PersonalAccount;
