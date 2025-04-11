import { useState, useEffect } from "react";
import axios from "axios";
import "./SpoonSystem.css";

const SpoonSystem = () => {
  const [spoons, setSpoons] = useState(5);
  const [usedToday, setUsedToday] = useState(0);
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

  const formatDateForSQL = (jsDate) => {
    const d = new Date(jsDate);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };


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

  const fetchUsedToday = async () => {
    try {
      const today = new Date();
      const todayYMD = formatDateForSQL(today);

      const res = await axios.get(`http://localhost:5000/events?user_id=${user.id}`);
      const total = res.data
        .filter((ev) => {
          const evDate = new Date(ev.event_date);
          return formatDateForSQL(evDate) === todayYMD;
        })
        .reduce((sum, ev) => sum + (parseInt(ev.resource) || 0), 0);

      setUsedToday(total);
    } catch (err) {
      console.error("Помилка завантаження подій:", err);
    }
  };

  fetchSpoons();
  fetchUsedToday();
}, [user]);


  const handleSpoonChange = (event) => {
    setSpoons(Number(event.target.value));
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (spoons < usedToday) {
      alert(`⛔ Ви вже використали ${usedToday} ложок. Неможливо встановити менше.`);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/spoons", {
        userId: user.id,
        spoons: Number(spoons),
      });
      setSubmitted(true);
      setAlreadySetToday(true);
      setDbSpoons(Number(spoons));
      setMessage("Ложки оновлено ✅");
    } catch (error) {
      alert(error.response?.data?.message || "Помилка при збереженні");
    }
  };

  const fillPercentage = (spoons / maxSpoons) * 100;

  return (
    <div className="spoon-container">
      {alreadySetToday ? (
        <>
          <h2 className="spoons-title">Мої ложки на сьогодні</h2>
          <p className="spoons-subtitle">
            Встановлено: <strong>{dbSpoons}</strong><br />
            Використано: <strong>{usedToday}</strong> ложок
          </p>
        </>
      ) : (
        <>
          <h2 className="spoons-title">На скільки ложок ви сьогодні себе відчуваєте?</h2>
          <input
            type="range"
            min="0"
            max={maxSpoons}
            step="1"
            value={spoons}
            onChange={handleSpoonChange}
            style={{
              background: `linear-gradient(to right, 
                            #776935 0%, 
                            #776935 ${fillPercentage}%, 
                            #d6bf76 ${fillPercentage}%, 
                            #d6bf76 100%)`,
            }}
          />
          <div className="tickmarks">
            {Array.from({ length: maxSpoons + 1 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
          <p className="spoons-subtitle">{spoons} ложок</p>
          <p className="spoons-subtitle">Використано сьогодні: <strong>{usedToday}</strong></p>
          <button onClick={handleSubmit} className="home-button">Зберегти</button>
          {message && <p className="message">{message}</p>}
        </>
      )}

      <p className="spoons-subtitle">Вдалого дня! Не забудьте відпочити ще сьогодні 🫖</p>
    </div>
  );
};

export default SpoonSystem;
