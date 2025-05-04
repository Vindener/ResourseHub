  import React from "react";
  import "./Tamagotchi.css";
  import CoinDisplay from "./CoinDisplay";
  import PetNameEditor from "./PetNameEditor";

  const MainPetScreen = ({ pet, onFeed, onClean, onSleep, onEditName,onShop,userId }) => {
    const petImages = {
  cat: "/images/pets/cat.png",
  dog: "/images/pets/dog.png",
  parrot: "/images/pets/parrot.png",
};

  // Мапа виглядів аксесуарів для різних типів тваринок
const petAccessoryImages = {
  1: { dog: "./images/pets/dog_skin_1.png", cat: "./images/pets/cat_skin_1.png", parrot: "./images/pets/parrot_skin_1.png" },
  2: { dog: "./images/pets/dog_skin_2.png", cat: "./images/pets/cat_skin_2.png", parrot: "./images/pets/parrot_skin_2.png" },
  3: { dog: "./images/pets/dog_skin_3.png", cat: "./images/pets/cat_skin_3.png", parrot: "./images/pets/parrot_skin_3.png" },
  4: { dog: "./images/pets/dog_skin_4.png", cat: "./images/pets/cat_skin_4.png", parrot: "./images/pets/parrot_skin_4.png" },
  5: { dog: "./images/pets/dog_skin_5.png", cat: "./images/pets/cat_skin_5.png", parrot: "./images/pets/parrot_skin_5.png" },
  6: { dog: "./images/pets/dog_skin_6.png", cat: "./images/pets/cat_skin_6.png", parrot: "./images/pets/parrot_skin_6.png" },
};

const baseImage = petImages[pet.type];
let finalImage = baseImage;

if (pet.active_accessory_id && petAccessoryImages[pet.active_accessory_id]) {
  finalImage = petAccessoryImages[pet.active_accessory_id][pet.type] || baseImage;
}

    return (
      <div className="pet-main-screen">
        <div className="pet-topbar">
          <CoinDisplay userId={userId} triggerReload={false} />
          <PetNameEditor
            name={pet.name}
            isEditable={true} // або завжди true, або передай як prop
            onSave={onEditName}
          />
          <button className="shop-button" onClick={onShop}>🛍</button>
        </div>

        <div className="tama-box">

        <div className="pet-image-area">
           <img src={finalImage} alt="pet" className="main-pet-image" />
        </div>
        </div>

        <div className="pet-actions">
          <p>😴 Сон: {pet.sleep_level}</p>
          <button className="pet-action-btn green" onClick={onSleep}>💤 Спатки</button>
          <p>🧼 Чистота: {pet.clean_level}</p>
          <button className="pet-action-btn blue" onClick={onClean}>🛁 Помити</button>
          <p>🍗 Голод: {pet.hunger_level}</p>
          <button className="pet-action-btn yellow" onClick={onFeed}>🍽 Погодувати</button>
        </div>
      </div>
    );
  };

  export default MainPetScreen;
