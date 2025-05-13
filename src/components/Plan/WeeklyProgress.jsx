import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import "./Plan.css";

const WeeklyProgress = () => {
  const [progress, setProgress] = useState(100);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/week/${user.id}`);
        setProgress(response.data.progress);
      } catch (error) {
        console.error("Помилка отримання даних", error);
      }
    };

    fetchTasks();
  }, [user]);

  const data = [
    { name: "Виконано", value: progress },
    { name: "Залишилось", value: 100 - progress },
  ];

  const COLORS = ["#4D2C91", "#D5C3E7"];

  return (
    <div className="weekly-container">
      <div className="chart-wrapper">
        <PieChart width={95} height={95}>
          <Pie
            data={data}
            cx={47.5}
            cy={47.5}
            innerRadius={30}
            outerRadius={40}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div className="chart-center-text">{progress}%</div>
      </div>

      <div>
        <h2 className="weekly-title">Прогрес виконання справ на тиждень</h2>
        <p className="weekly-text">
          {progress === 100
            ? "Супер! Усі задачі виконані"
            : progress >= 75
            ? "Молодець! Так тримати!"
            : progress >= 50
            ? "Добре йдеш, продовжуй!"
            : progress >= 25
            ? "Початок є, не зупиняйся!"
            : "Спробуй взятися за кілька справ"}
        </p>
      </div>
    </div>
  );
};

export default WeeklyProgress;
