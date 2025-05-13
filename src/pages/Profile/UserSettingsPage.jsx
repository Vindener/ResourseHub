import React, { useState, useEffect } from "react";
import "./UserSettings.css";
import axios from "axios";

const avatarList = [
  { id: 1, image: "/images/avatars/avatar1.png" },
  { id: 2, image: "/images/avatars/avatar2.png" },
];

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", avatar: "" });
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      setForm({
        username: userObj.username,
        email: userObj.email,
        avatar: userObj.avatar || "/images/avatars/avatar1.png",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (imagePath) => {
    setForm((prev) => ({ ...prev, avatar: imagePath }));
  };

  const handleSave = async () => {
  try {
    await axios.put(`http://localhost:5000/api/users/${user.id}`, {
      username: form.username,
      email: form.email,
      avatar: form.avatar,
    });

    if (newPassword.trim()) {
      await axios.put(`http://localhost:5000/api/users/${user.id}/password-direct`, {
        newPassword,
      });
    }

    const updated = await axios.get(`http://localhost:5000/api/users/${user.id}`);
    localStorage.setItem("user", JSON.stringify(updated.data));
    setUser(updated.data);
    alert("Зміни збережено!");
    window.location.href = "/account";
  } catch (error) {
    console.error("Помилка при оновленні профілю:", error);

    const serverError = error.response?.data;

    // Перевірка на дублювання email
    if (
      serverError?.sqlMessage?.includes("Duplicate entry") ||
      serverError?.message?.includes("Duplicate entry")
    ) {
      alert("Цей email вже використовується іншим користувачем.");
    } else {
      alert("Не вдалося зберегти зміни. Спробуйте інший email чи в інший час.");
    }
}

};


  const handleDelete = async () => {
    if (!window.confirm("Ви впевнені, що хочете видалити профіль?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${user.id}`);
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Помилка при видаленні профілю:", error);
      alert("Не вдалося видалити профіль.");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-content">

        <div className="avatar-selection">
          <h2 className="avatar-title">Аватар профілю</h2>
          <div className="avatar-list">
            {avatarList.map((a) => (
              <div
                key={a.id}
                className="avatar-wrapper"
                onClick={() => handleAvatarSelect(a.image)}
              >
                <img
                  src={a.image}
                  alt={`Avatar ${a.id}`}
                  className={`avatar-option ${form.avatar === a.image ? "selected" : ""}`}
                />
                {form.avatar === a.image && (
                  <img src="/images/avatars/checked.png" alt="Selected" className="avatar-check" />
                )}
              </div>
            ))}
          </div>
        </div>


        <div className="avatar-selection">
          <h3 className="avatar-subtitle">Нік користувача</h3>
          <input name="username" value={form.username} onChange={handleChange} />

          <h3 className="avatar-subtitle">E-MAIL</h3>
          <input name="email" value={form.email} onChange={handleChange} />

          <h3 className="avatar-subtitle">Змінити пароль</h3>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              placeholder="Новий пароль"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              role="button"
            >
             <img
                src={showPassword ? "/images/avatars/eye_closed.png" : "/images/avatars/eye_open.png"}
                alt={showPassword ? "Hide password" : "Show password"}
                className="eye-icon"
              />

            </span>
          </div>
          <h3 className="avatar-subtitle">Мінімальний пароль 5 символів</h3>
          <button className="save-button" onClick={handleSave}>
            Зберегти зміни
          </button>
        </div>   
      </div>
       <button className="avatar-delete-button" onClick={handleDelete}>
          Видалити профіль
        </button>

        <p className="info">
          При знаходженні помилок у роботі сервісу напишіть лист на e-mail  <br/>
          <b>globaann@gmail.com</b> і в найкоротший час баг буде виправлено.
        </p>
    </div>
  );
};

export default UserSettings;
