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
  const COLORS = ["#607053", "#BFE0A5"];

  console.log("Запит на", `http://localhost:5000/api/pets/${user?.id}`);

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
          cx="50%" cy="50%"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`}  fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="need-icon-centered">{icon}</div>
      {/* <div className="need-value">{value}%</div> */}
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

  const { name, sleep_level, clean_level, hunger_level, type, active_skin } = pet;

  // усередині компонента
  const toSafeValue = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
  };

  const s = toSafeValue(sleep_level);
  const c = toSafeValue(clean_level);
  const f = toSafeValue(hunger_level);

  const values = [s, c, f];

  const avg = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
  let happiness = "Щастя";
  if (avg < 34) happiness = "Сумний";
  else if (avg < 67) happiness = "Нормально";
  else happiness = "Щасливий";

  const getMoodColor = (value) => {
  if (value < 34) return "#d9534f";      // червоний
  if (value < 67) return "#f0ad4e";      // жовтий
  return "#5cb85c";                      // зелений
};


    const baseImage = petImages[pet.type];
    let finalImage = baseImage;

    if (pet.active_accessory_id && petAccessoryImages[pet.active_accessory_id]) {
      finalImage = petAccessoryImages[pet.active_accessory_id][pet.type] || baseImage;
    }

  return (
  <div className="pet-summary-card">
    <div className="pet-info">
      <p className="pet-name">{name}</p>
      <div className="pet-mood-bar">
          <div className="pet-mood-fill" style={{ width: `${avg}%`, backgroundColor: getMoodColor(avg) }}>
            {happiness} ({avg}%)
          </div>
        </div>
      <div className="pet-needs">
        {renderPie(s, "💤")}
        {renderPie(c, "🛁")}
        {renderPie(f, "🍽")}
      </div>
    </div>
    <img src={finalImage} alt="pet" className="pet-image" />
  </div>
);

};

export default PetSummaryCard;
