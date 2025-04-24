import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [petName, setPetName] = useState("Тузік");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Паролі не співпадають!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, petName, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Реєстрація успішна!");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Щось пішло не так. Спробуйте ще раз.");
    }
  };

  return (
    <div className="login-box">
      <h2>Реєстрація</h2>
        <p>Вже зареєстровані?  <a href="/login"> Натисніть тут</a></p>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ім'я користувача"
          required
        />
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Підтвердіть пароль"
          required
        />
        <br />
        <button type="submit" disabled={!email || !username || !password || password !== confirmPassword}>
          Зареєструватися
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
