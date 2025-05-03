import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AccessoryShop.css";
import CoinDisplay from "./CoinDisplay";
import PetNameEditor from "./PetNameEditor";


const AccessoryShop = ({ userId, onClose }) => {
  const [accessories, setAccessories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reloadCoins, setReloadCoins] = useState(false); 
  const [currentPetType, setCurrentPetType] = useState(null);
  const [petName, setPetName] = useState("");

useEffect(() => {
    const fetchCurrentPet = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/pets/${userId}`);
    setCurrentPetType(res.data.type);
    setPetName(res.data.name);
  } catch (err) {
    console.error("❌ Не вдалося отримати тип тваринки", err);
  }
};


  fetchCurrentPet();
  fetchAccessories();
}, [userId]);


  const fetchAccessories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user-accessories/${userId}`);
      setAccessories(res.data);

      const active = res.data.find(acc => acc.is_active);
      if (active) {
        setSelected(active.id);
      }
    } catch (err) {
      console.error("❌ Load error:", err);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, [userId]);
  
  const handleBuy = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/user-accessories", { userId, accessoryId: id });
      alert("Куплено!");
      await fetchAccessories();
      setReloadCoins(prev => !prev); // Оновлюємо монетки
    } catch (err) {
      alert(err.response?.data?.error || "Помилка покупки");
    }
  };

  const handleChangePet = async (type, cost) => {
  const confirm = window.confirm(`Це коштує ${cost} монет. Змінити тваринку?`);
  if (!confirm) return;

  try {
    await axios.put("http://localhost:5000/api/user/change-pet", {
      userId,
      newPetType: type,
      cost,
    });
    alert("🎉 Тваринку змінено!");
    onClose?.();
  } catch (err) {
    alert(err.response?.data?.error || "Не вдалося змінити тваринку");
  }
};


const handleActivate = async (accessoryId) => {
  try {
    await axios.put("http://localhost:5000/api/user-accessories/activate", {
      userId,
      accessoryId,
    });
    await fetchAccessories();
    setReloadCoins(prev => !prev);
    alert("✅ Аксесуар активовано!");
    onClose?.(); // повернення
  } catch (err) {
    console.error("❌ Activation error:", err);
    alert("Помилка активації");
  }
};

  return (
    <div className="shop-container">
      <div className="shop-header">
        <button className="back-button" onClick={onClose}>
          ← Назад
        </button>
        <PetNameEditor
          name={petName}
          isEditable={false}
        />

        <CoinDisplay userId={userId} triggerReload={reloadCoins} />
      </div>

      <h2>Магазин скінів</h2>
      <div className="shop-grid">
        {accessories.map((a) => (
          <div
            key={a.id}
            className={`item ${a.purchased ? "owned" : ""} ${
              selected === a.id ? "selected" : ""
            }`}
          >
            <img src={a.icon_url} alt={a.name} />
            <p>{a.name}</p>

            {/* Якщо куплено — "+" без ціни */}
            {a.purchased ? (
              <>
                <div className="price"></div>
                <button
                  className={a.is_active ? "active-button" : ""}
                  disabled={a.is_active}
                  onClick={() => handleActivate(a.id)}
                >
                  {a.is_active ? "✅ Активно" : "➕ Обрати"}
                </button>

              </>
            ) : (
              <>
                <div className="price">
                  <span>{a.price}</span> 💰
                </div>
                <button onClick={() => handleBuy(a.id)}>Купити</button>
              </>
            )}
          </div>
        ))}
      </div>
<div className="pet-choices">
  {["dog", "cat", "parrot"].map((type) => {
    const petImage = `/images/pets/${type}.png`;
    const isActive = currentPetType === type;

    return (
      <div key={type} className={`pet-choice ${isActive ? "active-pet" : ""}`}>
        <img src={petImage} alt={type} className="pet-icon" />
        <p>{type === "dog" ? "Песик" : type === "cat" ? "Котик" : "Папуга"}</p>
                 
        <button className={"pet-button"}  disabled={isActive} onClick={() => handleChangePet(type, 100)}>
          {isActive ? "Встановлено" : "100 "}
        </button>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default AccessoryShop;
