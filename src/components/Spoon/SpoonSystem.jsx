import { useState, useEffect } from "react";
import axios from "axios";
import "./SpoonSystem.css";

const SpoonSystem = () => {
  const [spoons, setSpoons] = useState(5);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadySetToday, setAlreadySetToday] = useState(false);
  const [dbSpoons, setDbSpoons] = useState(null);
  const maxSpoons = 14;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchSpoons = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/spoons/${user.id}`);
        const { spoons, last_spoons_update } = res.data;

        setDbSpoons(spoons);

        if (last_spoons_update) {
          const today = new Date().toISOString().split("T")[0];
          const updatedDate = new Date(last_spoons_update).toISOString().split("T")[0];
          setAlreadySetToday(today === updatedDate);
        }
      } catch (error) {
        console.error("Помилка завантаження ложок:", error);
      }
    };

    fetchSpoons();
  }, [user]);
  

  const handleSpoonChange = (event) => {
    setSpoons(event.target.value);
  };

   const handleSubmit = async () => {
    if (!user) return;

    try {
      const res = await axios.post("http://localhost:5000/api/spoons", {
        userId: user.id,
        spoons: Number(spoons),
      });
      console.log(res.data.message);
      setSubmitted(true);
      setAlreadySetToday(true);
      setDbSpoons(Number(spoons));
    } catch (error) {
      alert(error.response?.data?.message || "Помилка при збереженні");
    }
  };

  // Обчислюємо, наскільки відсотків має бути зафарбовано зліва
  const fillPercentage = (spoons / 14) * 100;
  return (
    <div className="spoon-container">
      {alreadySetToday ? (
        <>
        <h2 className="spoons-title">Мої ложки на сьогодні</h2>
        <p className="spoons-subtitle">Кількість ложок: <strong>{dbSpoons}</strong> (вже встановлено на сьогодні)</p>
        </>
      ) : (
        <>
        <h2 className="spoons-title">На скільки ложок ви сьогодні себе відчуваєте?</h2>
        <input
          type="range"
          min="0"
          max="14"
          step="1"
          value={spoons}
          onChange={handleSpoonChange}
          style={{
            /* У Chrome/Safari/Edge використовується фон з градієнтом,
               який покриває доріжку від 0% до поточного значення. */
            background: `linear-gradient(to right, 
                           #776935 0%, 
                           #776935 ${fillPercentage}%, 
                           #d6bf76 ${fillPercentage}%, 
                           #d6bf76 100%)`,
          }}
        />
        {/* Цифри (позначки) під слайдером */}
         <div className="tickmarks">
          {Array.from({ length: maxSpoons + 1 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        <p className="spoons-subtitle">{spoons} ложок</p>
        <button onClick={handleSubmit}>Зберегти</button>
        {message && <p className="message">{message}</p>}
      </>
        
      )}
        <p className="spoons-subtitle">Вдалого дня! Не забудьте відпочити ще сьогодні</p>
    </div>
  );
};

export default SpoonSystem;
