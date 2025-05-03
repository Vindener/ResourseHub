import React from "react";
import "./Tamagotchi.css";
import "./CoinDisplay.css";

const IntroScreen = ({ onContinue }) => {
  return (
    <div className="tama-intro-container">
      <div className="tama-intro-header">
        <div className="coin-display-container tama-intro-coin">
          💰 <span>0 монет</span>
        </div>

        <div className="coin-display-container tama-intro-name">
            <span className="pet-name-editor name-display">???</span>
        </div>
      </div>

      <div className="tama-intro-box">
        <h3><strong>Тамагочі</strong> — це твій віртуальний улюбленець у нашому застосунку!</h3>
        <p>
          Він живе разом із тобою в цьому просторі.<br />
          Турбуйся про нього:
        </p>
        <ul>
          <li><strong>Годуй</strong></li>
          <li><strong>Доглядай</strong></li>
          <li><strong>Давай йому відпочити</strong></li>
        </ul>
        <p>
          Твій тамагочі — не просто милий компаньйон, а й символ турботи про себе.<br />
          Як ти піклуєшся про нього, так і про себе.
        </p>
      </div>

      <button className="tama-start-button" onClick={onContinue}>
        🐾 Я хочу додати собі компаньйона!
      </button>
    </div>
  );
};

export default IntroScreen;
