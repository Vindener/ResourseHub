import React, { useState, useEffect } from "react";

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60); // Поточний час у секундах
  const [isRunning, setIsRunning] = useState(false); // Чи працює таймер
  const [isBreak, setIsBreak] = useState(false); // Чи це час відпочинку
  const [method, setMethod] = useState("Pomodoro"); // Вибраний метод
  const [customTime, setCustomTime] = useState(""); // Власний час у хвилинах

  // Таймер
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer);
      playSound(); // Грати звук після завершення
      setIsBreak((prev) => !prev); // Перемикаємося між роботою і відпочинком
      setTime(isBreak ? 25 * 60 : 5 * 60); // 25 хвилин роботи або 5 хвилин відпочинку
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isBreak]);

  // Функція для програвання звуку
  const playSound = () => {
    const audio = new Audio(
      "https://www.soundjay.com/button/beep-07.wav" // URL звуку
    );
    audio.play();
  };

  // Почати або зупинити таймер
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Скинути таймер
  const resetTimer = () => {
    setIsRunning(false);
    setTime(isBreak ? 5 * 60 : 25 * 60);
  };

  // Вибір методу
  const selectMethod = (method) => {
    setMethod(method);
    setIsBreak(false);
    setIsRunning(false);
    if (method === "Pomodoro") setTime(25 * 60);
    else if (method === "Short Break") setTime(5 * 60);
    else if (method === "Long Break") setTime(15 * 60);
  };

  // Встановлення власного таймера
  const setCustomTimer = () => {
    const minutes = parseInt(customTime);
    if (!isNaN(minutes) && minutes > 0) {
      setTime(minutes * 60);
      setMethod("Custom");
      setIsBreak(false);
      setIsRunning(false);
    } else {
      alert("Введіть коректну кількість хвилин!");
    }
  };

  // Форматування часу
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Таймер для методу "Помодоро"</h1>
      <div>
        <button onClick={() => selectMethod("Pomodoro")}>Помодоро</button>
        <button onClick={() => selectMethod("Short Break")}>Короткий відпочинок</button>
        <button onClick={() => selectMethod("Long Break")}>Довгий відпочинок</button>
      </div>

      <h2>{method}</h2>
      <div
        style={{
          fontSize: "48px",
          margin: "20px 0",
          fontWeight: "bold",
          color: isBreak ? "green" : "red",
        }}
      >
        {formatTime(time)}
      </div>

      <div>
        <button onClick={toggleTimer} style={{ marginRight: "10px" }}>
          {isRunning ? "Зупинити" : "Почати"}
        </button>
        <button onClick={resetTimer}>Скинути</button>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic" }}>
        {isBreak
          ? "Час для відпочинку! Розслабтесь і наберіться сил."
          : "Час для роботи! Зосередьтесь на своїх завданнях."}
      </p>

      {/* Встановлення власного таймера */}
      <div style={{ marginTop: "20px" }}>
        <h3>Встановіть власний таймер</h3>
        <input
          type="number"
          value={customTime}
          onChange={(e) => setCustomTime(e.target.value)}
          placeholder="Введіть хвилини"
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button onClick={setCustomTimer}>Встановити</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
