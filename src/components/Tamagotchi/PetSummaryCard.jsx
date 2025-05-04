import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PetSummaryCard.css";
import { PieChart, Pie, Cell } from "recharts";

const petImages = {
  cat: "/images/pets/cat.png",
  dog: "/images/pets/dog.png",
  parrot: "/images/pets/parrot.png",
};

const petAccessoryImages = {
  1: { dog: "./images/pets/dog_skin_1.png", cat: "./images/pets/cat_skin_1.png", parrot: "./images/pets/parrot_skin_1.png" },
  2: { dog: "./images/pets/dog_skin_2.png", cat: "./images/pets/cat_skin_2.png", parrot: "./images/pets/parrot_skin_2.png" },
  3: { dog: "./images/pets/dog_skin_3.png", cat: "./images/pets/cat_skin_3.png", parrot: "./images/pets/parrot_skin_3.png" },
  4: { dog: "./images/pets/dog_skin_4.png", cat: "./images/pets/cat_skin_4.png", parrot: "./images/pets/parrot_skin_4.png" },
  5: { dog: "./images/pets/dog_skin_5.png", cat: "./images/pets/cat_skin_5.png", parrot: "./images/pets/parrot_skin_5.png" },
  6: { dog: "./images/pets/dog_skin_6.png", cat: "./images/pets/cat_skin_6.png", parrot: "./images/pets/parrot_skin_6.png" },
};

const PetSummaryCard = () => {
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadPet = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pets/${user.id}`);
        if (res.data && res.data.name) {
          setPet(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("🐾 Помилка завантаження улюбленця:", err);
        setError(true);
      }
    };

    if (user?.id) loadPet();
  }, [user?.id]);

  const renderPie = (value, icon) => {
  const data = [
    { name: "filled", value },
    { name: "empty", value: 100 - value },
  ];
  const COLORS = ["#333", "#D2D2D2"];

  return (
    <div className="need-pie-wrapper">
      <PieChart width={50} height={50}>
        <Pie
          data={data}
          innerRadius={18}
          outerRadius={25}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="need-icon-centered">{icon}</div>
    </div>
  );
};


  if (error) {
    return (
      <div className="pet-summary-card">
        <p>У вас ще немає тваринки 😿</p>
        <button className="add-button" onClick={() => (window.location.href = "/tamagotchi")}>
          Створити тваринку
        </button>
      </div>
    );
  }

  if (!pet) return null;

  const { name, sleep, clean, food, type, active_skin } = pet;

  // усередині компонента
  const s = Math.max(0, Math.min(100, Number(sleep)));
  const c = Math.max(0, Math.min(100, Number(clean)));
  const f = Math.max(0, Math.min(100, Number(food)));
  const values = [s, c, f];

  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

  let happiness = "Щастя";
  if (avg < 50) happiness = "Сум";
  else if (avg >= 50) happiness = "Нормально";

  const petImage =
    active_skin && petAccessoryImages[active_skin]?.[type]
      ? petAccessoryImages[active_skin][type]
      : petImages[type];

  return (
  <div className="pet-summary-card">
    <div className="pet-info">
      <p className="pet-name">{name}</p>
      <span className="pet-mood">{happiness}</span>
      <div className="pet-needs">
        {renderPie(s, "💤")}
        {renderPie(c, "🛁")}
        {renderPie(f, "🍽")}
      </div>
    </div>
    <img src={petImage} alt="pet" className="pet-image" />
  </div>
);

};

export default PetSummaryCard;
