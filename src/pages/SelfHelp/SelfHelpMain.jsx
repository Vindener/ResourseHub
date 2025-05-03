import React from "react";
import { useNavigate } from "react-router-dom";
import "./SelfHelp.css";

const topics = [
  { title: "Поняття РДУГ та його ознаки у людини", path: "adhd", color: "violet" },
  { title: "Поради для тайм-менеджменту", path: "timemanagement", color: "green" },
  { title: "Фокус-сесія", path: "focus", color: "yellow" },
  { title: "Відпочинок для нейровідмінних", path: "rest", color: "blue" },
];

const SelfHelpMain = () => {
  const navigate = useNavigate();

  return (
    <div className="selfhelp-container">
      {topics.map((topic, idx) => (
        <div
          key={idx}
          className={`selfhelp-button ${topic.color}`}
          onClick={() => navigate(`/selfhelp/${topic.path}`)}
        >
          {topic.title}
        </div>
      ))}
    </div>
  );
};

export default SelfHelpMain;
