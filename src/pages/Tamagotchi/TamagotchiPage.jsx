import React, { useEffect, useState } from "react";
import PetIntroScreen from "./IntroScreen";
import PetSelectionScreen from "./PetSelectionScreen";
import MainPetScreen from "./MainPetScreen";
import axios from "axios";
import AccessoryShopScreen from "./AccessoryShopScreen";

const TamagotchiPage = () => {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [step, setStep] = useState("loading"); // loading | intro | select | main | shop

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadPet(parsedUser.id);
    }
  }, []);

  const loadPet = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/pets/${userId}`);
    if (res.data && res.data.name) {
      setPet(res.data);
      setStep("main"); // 👉 показує головний екран
    } else {
      setStep("intro"); // 👉 показує вступ
    }
  } catch (error) {
    console.log("🐾 Помилка завантаження улюбленця:", error);
    setStep("intro"); // 👉 якщо помилка — все одно показує вступ
  }
};

  const handleStartSelect = () => {
    setStep("select");
  };

const handlePetCreated = async (type, name) => {
  try {
    console.log("🐾 Надсилаємо:", { user_id: user.id, name, type });
    const res = await axios.post("http://localhost:5000/api/pets", {
      user_id: user.id,
      name,
      type,
    });
    setPet({ ...res.data, type, name });
    setStep("main");
  } catch (error) {
    console.error("❌ Помилка створення улюбленця:", error);
  }
};


  const handleEditName = (newName) => {
    setPet((prev) => ({ ...prev, name: newName }));
    axios.put(`http://localhost:5000/api/pets/${user.id}`, {
      name: newName,
    });
  };

const handleAction = async (actionType) => {
  const randomValue = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

  // Поточний рівень з pet
  const currentLevel =
    actionType === "feed"
      ? pet.hunger_level
      : actionType === "clean"
      ? pet.clean_level
      : pet.sleep_level;

  if (currentLevel >= 100) {
    alert("🔔 Цей параметр вже на максимумі!");
    return;
  }

  try {
    await axios.put(`http://localhost:5000/api/pets/${user.id}/action`, {
      action: actionType,
      value: randomValue,
    });

    alert(
      `🎉 ${actionType === "feed" ? "Голод" : actionType === "clean" ? "Чистота" : "Сон"} відновлено на ${randomValue}`
    );

    loadPet(user.id); // оновлюємо
  } catch (err) {
    console.error("❌ Помилка виконання дії:", err);
  }
};
  if (step === "loading") return <p>Завантаження...</p>;

  return (
    <>
      {step === "intro" && <PetIntroScreen onContinue={handleStartSelect} />}
      {step === "select" && <PetSelectionScreen onConfirm={handlePetCreated} onClose={() => {
            setStep("intro");   
          }} />}
      {step === "main" && pet && (
        <MainPetScreen
          pet={pet}
          onFeed={() => handleAction("feed")}
          onClean={() => handleAction("clean")}
          onSleep={() => handleAction("sleep")}
          onEditName={handleEditName}
          onShop={() => setStep("shop")}
          userId={user.id}
        />
      )}
      {step === "shop" && (
        <AccessoryShopScreen
          userId={user.id}
          onClose={() => {
            loadPet(user.id); 
            setStep("main");   
          }}
        />
      )}
    </>
  );
};

export default TamagotchiPage;
