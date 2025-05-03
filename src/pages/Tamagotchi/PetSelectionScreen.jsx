import React, { useState } from "react";
import "./Tamagotchi.css";
import "./CoinDisplay.css";

const pets = [
  { id: "cat", name: "Котик", emoji: "🐱", image: "/images/pets/cat.png" },
  { id: "dog", name: "Песик", emoji: "🐶", image: "/images/pets/dog.png" },
  { id: "parrot", name: "Папужка", emoji: "🦜", image: "/images/pets/parrot.png" },
];

const PetSelectionScreen = ({ onConfirm, onClose }) => {
  const [selectedPetIndex, setSelectedPetIndex] = useState(1); // За замовчуванням песик
  const [petName, setPetName] = useState("");

  const handleLeft = () => {
    setSelectedPetIndex((prev) => (prev - 1 + pets.length) % pets.length);
  };

  const handleRight = () => {
    setSelectedPetIndex((prev) => (prev + 1) % pets.length);
  };

  const handleSubmit = () => {
    if (petName.trim().length < 2) {
      alert("Введіть ім’я вашого улюбленця");
      return;
    }
    onConfirm(pets[selectedPetIndex].id, petName);
  };

  return (
    <div className="tama-selection-container">
      <div className="tama-intro-header">
        <div className="coin-display-container tama-intro-coin">
          💰 <span>0 монет</span>
        </div>

        <div className="coin-display-container tama-intro-name">
          <input
            type="text"
            className="tama-name-input pet-name-editor"
            placeholder="Напиши ім’я свого тамагочі тут…"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
        </div>
      </div>

      {/* Білий контейнер з каруселлю */}
      <div className="tama-intro-box">
        <div className="carousel-top-bar">
          <button className="back-button" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.854 0.423957L1.29873 8.19615C-0.432911 9.18706 -0.432911 10.8117 1.29873 11.8039L14.854 19.576C16.5856 20.5694 18 19.7564 18 17.7722V2.22781C18 0.243572 16.5832 -0.569364 14.854 0.423957Z" fill="#555555"/>
            </svg>
          </button>
        </div>

        <div className="tama-carousel">
          <button onClick={handleLeft} className="carousel-btn">
            <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 37.9988V1.99777C29.9989 1.63328 29.8981 1.276 29.7087 0.964394C29.5193 0.652782 29.2483 0.398643 28.925 0.229332C28.6016 0.0600204 28.2381 -0.018055 27.8736 0.00351334C27.5091 0.0250778 27.1574 0.14547 26.8564 0.351727L0.809944 18.3522C-0.269981 19.0983 -0.269981 20.8943 0.809944 21.6423L26.8564 39.6428C27.1568 39.8512 27.5087 39.9734 27.8738 39.9961C28.2389 40.0189 28.6033 39.9413 28.9273 39.7718C29.2513 39.6024 29.5227 39.3475 29.7118 39.0349C29.9009 38.7223 30.0006 38.364 30 37.9988Z" fill="#FAF4E4"/>
            </svg>
          </button>
          <img
            src={pets[selectedPetIndex].image}
            alt={pets[selectedPetIndex].name}
            className="tama-image"
          />
          <button onClick={handleRight} className="carousel-btn">
            <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.90735e-06 2.0012V38.0022C0.00114822 38.3667 0.101852 38.724 0.291279 39.0356C0.480703 39.3472 0.751673 39.6014 1.07502 39.7707C1.39838 39.94 1.76187 40.0181 2.12636 39.9965C2.49086 39.9749 2.84256 39.8545 3.14361 39.6483L29.1901 21.6478C30.27 20.9017 30.27 19.1057 29.1901 18.3577L3.14361 0.357158C2.84319 0.148801 2.49131 0.0266165 2.1262 0.00387796C1.7611 -0.0188606 1.39674 0.0587169 1.0727 0.228182C0.748665 0.397647 0.477346 0.652518 0.288229 0.965103C0.0991116 1.27769 -0.000574112 1.63603 1.90735e-06 2.0012Z" fill="#FAF4E4"/>
            </svg>
          </button>
        </div>
      </div>

      <button className="tama-start-button" onClick={handleSubmit}>
        🐾 Я обрав собі тамагочі. Вперед!
      </button>
    </div>
  );
};

export default PetSelectionScreen;
