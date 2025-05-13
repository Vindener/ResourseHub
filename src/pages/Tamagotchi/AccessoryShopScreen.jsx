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
      onClose?.();
    } catch (err) {
      console.error("❌ Activation error:", err);
      alert("Помилка активації");
    }
  };

  return (
    <>
    <div className="shop-header">
        <button className="back-button" onClick={onClose}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.854 0.423957L1.29873 8.19615C-0.432911 9.18706 -0.432911 10.8117 1.29873 11.8039L14.854 19.576C16.5856 20.5694 18 19.7564 18 17.7722V2.22781C18 0.243572 16.5832 -0.569364 14.854 0.423957Z" fill="#555555"/>
          </svg>
        </button>
        <PetNameEditor
          name={petName}
          isEditable={false}
        />

        <CoinDisplay userId={userId} triggerReload={reloadCoins} />
      </div>
    
    <div className="shop-container">
      

      <h2 className="shop-title">Магазин скінів</h2>
      <div className="shop-grid">
        {accessories.map((a) => (
          <div
            key={a.id}
            className={`item ${a.purchased ? "owned" : ""} ${
              selected === a.id ? "selected" : ""
            }`}
          >
            <img src={a.icon_url} alt={a.name} className="item-image" />
            {a.purchased ? (
              <div className="buy-block">
                <button
                  className={a.is_active ? "active-button" : "buy-button"}
                  disabled={a.is_active}
                  onClick={() => handleActivate(a.id)}
                >
                   {a.is_active ? (
                    <img  src="/images/tamagotchi/buyed.png" alt="coins" className="coin-price" />
                  ) : (
                    "➕"
                  )}
                </button>
                <div className="buy-price">
                  <span>Куплено</span>
                </div>
              </div>
            ) : (
              <div className="buy-block">
                <button className="buy-button" onClick={() => handleBuy(a.id)}>➕</button>
                <div className="buy-price">
                  <span>{a.price}
                     <img src={"/images/tamagotchi/coins.png"} alt="coins" className="coin-price" />
                  </span> 
                </div>
              </div>
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
              <img src={petImage} alt={type} className="item-image" />

              {isActive ? (
                <button className="pet-button" disabled>
                 <img src="/images/tamagotchi/buyed.png" alt="coins" className="coin-price" />
                </button>
              ) : (
                <div className="buy-block">
                  <button className="buy-button" onClick={() => handleChangePet(type, 100)}>➕</button>
                  <div className="buy-price">
                    <span>100
                      <img src="/images/tamagotchi/coins.png" alt="coins" className="coin-price" />
                    </span> 
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default AccessoryShop;