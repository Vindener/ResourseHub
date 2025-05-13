import React, { useEffect, useState } from "react";
import "./Profile.css";
import WeeklyProgress from "../../components/Plan/WeeklyProgress";
import PetSummaryCard from "../../components/Tamagotchi/PetSummaryCard";
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
      <div className="profile-card">
        <div className="profile-banner" />

        <div className="profile-info-section">
          <div className="profile-avatar">
            <img src={user?.avatar || "images/avatars/avatar1.png"} alt="Avatar" />
          </div>

          <div className="profile-main">
            <h3>{user?.username || "User"}</h3>
            <button className="edit-button" onClick={() => navigate(`/account/settings`)}>
              <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24.6008V29.6668C0 30.1334 0.366617 30.5 0.83322 30.5H5.8992C6.11584 30.5 6.33247 30.4167 6.48245 30.25L24.68 12.0692L18.4308 5.82002L0.249966 24.0009C0.0833222 24.1675 0 24.3675 0 24.6008ZM29.5127 7.23649C29.6671 7.08232 29.7897 6.8992 29.8733 6.69761C29.957 6.49601 30 6.2799 30 6.06165C30 5.8434 29.957 5.62729 29.8733 5.4257C29.7897 5.2241 29.6671 5.04098 29.5127 4.88681L25.6132 0.987341C25.459 0.832856 25.2759 0.710293 25.0743 0.626669C24.8727 0.543044 24.6566 0.5 24.4384 0.5C24.2201 0.5 24.004 0.543044 23.8024 0.626669C23.6008 0.710293 23.4177 0.832856 23.2635 0.987341L20.2139 4.03693L26.4631 10.2861L29.5127 7.23649Z" fill="#776935"/>
              </svg>
               Редагування профілю</button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="progress-block">
            <WeeklyProgress />
          </div>

          <div className="pet-block">
            <PetSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
