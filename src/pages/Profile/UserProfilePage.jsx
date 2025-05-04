import React, { useEffect, useState } from "react";
import "./Profile.css";
import WeeklyProgress from "../../components/Plan/WeeklyProgress";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Особистий профіль</h2>
      </div>

      <div className="profile-card">
        <div className="profile-banner" />

        <div className="profile-info-section">
          <div className="profile-avatar">
            <img src={user?.avatar || "images/avatars/avatar1.png"} alt="Avatar" />
          </div>

          <div className="profile-main">
            <h3>{user?.username || "User"}</h3>
            <button className="edit-button" onClick={() => navigate(`/account/settings`)}>✏️ Редагування профілю</button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="progress-block">
            <WeeklyProgress />
          </div>

          <div className="pet-block">
            <div className="pet-title">Тузік</div>
            <div className="pet-emotions">
              <span>💤</span>
              <span>🍔</span>
              <span>🧼</span>
              <span>🧠</span>
            </div>
            <div className="pet-avatar">
              <img src="/pets/dog.png" alt="Pet" />
            </div>
            <div className="pet-status">Щастя</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
