import React, { useState, useEffect } from "react";
import "./SelfHelp.css";

const SelfHelpFocus = () => {
 const [time, setTime] = useState(() => {
  const cached = localStorage.getItem("focusState");
  if (cached) {
    const parsed = JSON.parse(cached);
    const now = Date.now();
    const deltaSec = Math.floor((now - parsed.lastSaved) / 1000);
    const newTime = parsed.time - deltaSec;
    return newTime > 0 ? newTime : (parsed.isBreak ? 5 * 60 : 25 * 60);
  }
  return 25 * 60;
});

  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Відновлення з кешу
useEffect(() => {
  const cached = localStorage.getItem("focusState");
  if (cached) {
    const parsed = JSON.parse(cached);
    const now = Date.now();
    const deltaSec = Math.floor((now - parsed.lastSaved) / 1000);

    let newTime = parsed.time - deltaSec;
    let newIsBreak = parsed.isBreak;
    let newIsRunning = parsed.isRunning;

    if (newTime <= 0) {
      newIsBreak = !newIsBreak;
      newTime = newIsBreak ? 5 * 60 : 25 * 60;
      newIsRunning = false;
    }

    // Встановлюємо всі одразу
    setTime(newTime);
    setIsBreak(newIsBreak);
    setIsRunning(newIsRunning);
  }
}, []);



  // Запуск таймера
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          const nextIsBreak = !isBreak;
          setIsBreak(nextIsBreak);
          setIsRunning(false); // автозупинка
          return nextIsBreak ? 5 * 60 : 25 * 60;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  // Збереження в localStorage
  useEffect(() => {
    localStorage.setItem(
      "focusState",
      JSON.stringify({
        time,
        isBreak,
        isRunning,
        lastSaved: Date.now(),
      })
    );
  }, [time, isBreak, isRunning]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="selfhelp-container">
      <div className="selfhelp-text-block yellow-bg">
        <h2 className="selfhelp-title">Фокус-сесія</h2>
      </div>

      <div className="focus-times">
        <div>
          <p><strong>Час роботи (у хв)</strong></p>
          <div className="focus-time-value">🕒 25:00</div>
        </div>
        <div>
          <p><strong>Час відпочинку (у хв)</strong></p>
          <div className="focus-time-value">🕒 5:00</div>
        </div>
      </div>

      <div className={`focus-timer ${isBreak ? "blue-bg" : "yellow-bg"}`}>
        {formatTime(time)}
      </div>

      <p className="focus-message">
        {isBreak
          ? "Час для відпочинку! Ви молодець, так тримати!"
          : "Час для роботи! Зосередьтесь на своїх завданнях)"}
      </p>

      <div className="focus-buttons">
        <button className="selfhelp-button violet" onClick={toggleTimer}>
          {isRunning ? "Зупинити" : "Почати"}
        </button>
        <button className="selfhelp-button green" onClick={resetTimer}>
          Скинути
        </button>
      </div>
    </div>
  );
};

export default SelfHelpFocus;
