import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CoinDisplay.css";

const CoinDisplay = ({ userId, triggerReload }) => {
  const [coins, setCoins] = useState(0);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const toYMD = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const fetchCoins = async (checkBonus = false) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${userId}/coins`);
      const { coins, last_coin_claim } = res.data;
      setCoins(coins || 0);

      if (checkBonus && !bonusClaimed) {
        const todayStr = toYMD(new Date());
        const claimedStr = last_coin_claim ? toYMD(new Date(last_coin_claim)) : null;

        if (claimedStr !== todayStr) {
          const reward = Math.floor(Math.random() * (50 - 5 + 1)) + 5;

          await axios.put(`http://localhost:5000/api/users/${userId}/claim-coins`, {
            amount: reward,
          });

          setCoins((prev) => prev + reward);
          setBonusClaimed(true);
          alert(`🎁 Ви отримали ${reward} монет сьогодні!`);
        }
      }
    } catch (err) {
      console.error("❌ Помилка завантаження монет:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchCoins(true); // тільки на початку перевіряємо бонус
  }, [userId]);

  useEffect(() => {
    if (triggerReload) fetchCoins(false); // тільки оновлення монет без бонусу
  }, [triggerReload]);

  return (
    <div className="coin-display-container">
      <img src={"/images/tamagotchi/coins.png"} alt="coins" className="coin-icon" />
       <span>{coins} монет</span>
    </div>
  );
};

export default CoinDisplay;
