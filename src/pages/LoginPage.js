import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User data:", data.user); // Перевіряємо, чи отримуємо користувача
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Вхід успішний!");
        console.log("Отримані дані з localStorage:", data.user);

        // Використовуємо window.location.href для більшого контролю
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Помилка:", error);
    }
};


  return (
    <div className="login-box">
      <h2>Вхід</h2>
        <p>Ще не зареєстувались?  <a href="/register"> Натисніть тут</a></p>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
        <br />
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginPage;
