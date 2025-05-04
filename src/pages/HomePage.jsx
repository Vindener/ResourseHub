import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarWithNotes from "../components/calendar/CalendarForHome";
import PlanListForHome from "../components/Plan/PlanListForHome";
import WeeklyProgress from "../components/Plan/WeeklyProgress";
import SpoonSystem from "../components/Spoon/SpoonSystem";
import AddNoteModal from "../components/Notes/AddNoteModal";
import PetSummaryCard from "../components/Tamagotchi/PetSummaryCard";
import "./Test.css";

const HomePage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNotes = () => {
    alert("Нотатку додано!");
  };
    
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

    const handleAddTodayEvent = () => {
        navigate("/calendar/new", {
    state: { from: "/calendar/home" },
    });
  };

  return (
    <div className="container">
      <div className="progress-today-block">
        <WeeklyProgress />
      </div>

      <div className="tamagochi-block">
        <PetSummaryCard />
      </div>

      <div className="calendar-block">
        <CalendarWithNotes />
      </div>

      <div className="spoons-block">
        <SpoonSystem />
      </div>

      <div className="today-block">
        <PlanListForHome />
      </div>

      <div className="fast-actions-block">
        <h3>Швидкі дії</h3>
        <div className="quick-actions">
          <div className="quick-card" onClick={() => setIsModalOpen(true)}>
            <svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7604 12.534L33.3085 15.076M21.7164 20.1261L26.4884 21.3981M21.9544 34.4323L23.8624 34.9423C29.2625 36.3824 31.9625 37.1004 34.0906 35.8784C36.2166 34.6583 36.9406 31.9723 38.3866 26.6042L40.4327 19.0101C41.8807 13.64 42.6027 10.956 41.3747 8.83994C40.1467 6.72391 37.4486 6.0059 32.0465 4.56788L30.1385 4.05787C24.7384 2.61785 22.0384 1.89984 19.9123 3.12186C17.7843 4.34188 17.0603 7.02792 15.6123 12.396L13.5682 19.9901C12.1202 25.3602 11.3962 28.0442 12.6262 30.1603C13.8543 32.2743 16.5543 32.9943 21.9544 34.4323Z" stroke="#121212" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22.0004 40.3925L20.0963 40.9125C14.7082 42.3785 12.0162 43.1125 9.89217 41.8665C7.77214 40.6225 7.04813 37.8865 5.60611 32.4104L3.56408 24.6663C2.12005 19.1922 1.39804 16.4541 2.62406 14.2981C3.68408 12.4321 6.00011 12.5001 9.00016 12.5001" stroke="#121212" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            Додати нову нотатку</div>
          <div className="quick-card" onClick={handleAddTodayEvent}>
            <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.38889 2.72278V4.94444V5.44444H8.88889H4.45278L4.13851 5.45492C3.14999 5.53182 2.22653 5.97822 1.55217 6.70543C0.875524 7.43511 0.499685 8.39359 0.5 9.38873L0.5 9.38889V36.0472L0.510476 36.3615C0.587375 37.35 1.03377 38.2735 1.76098 38.9478C2.49067 39.6245 3.44915 40.0003 4.44428 40H4.44444H35.5473L35.8615 39.9895C36.85 39.9126 37.7735 39.4662 38.4478 38.739C39.1245 38.0093 39.5003 37.0509 39.5 36.0557V36.0556V9.39719L39.4895 9.08299C39.4126 8.09445 38.9662 7.17098 38.239 6.49662C37.5093 5.81997 36.5509 5.44413 35.5557 5.44444H35.5556H31.1111H30.6111V4.94444V2.73717L30.5974 2.50737C30.5453 2.09359 30.3449 1.71256 30.033 1.43523L30.3636 1.06349L30.033 1.43523C29.7178 1.15494 29.3107 1.00007 28.8889 1L9.38889 2.72278ZM9.38889 2.72278C9.38938 2.28382 9.55746 1.86161 9.85879 1.54242C10.1601 1.22323 10.572 1.03115 11.0102 1.00542C11.4484 0.9797 11.8799 1.12227 12.2165 1.40401C12.5496 1.68281 12.7649 2.07706 12.8196 2.50765M9.38889 2.72278L12.8196 2.50765M12.8196 2.50765L12.8333 2.73716V4.94444V5.44444H13.3333H26.6667H27.1667V4.94444V2.72222C27.1667 2.26546 27.3481 1.82741 27.6711 1.50443C27.9941 1.18146 28.4321 1.00002 28.8888 1L12.8196 2.50765ZM36.0556 20.5V20H35.5556H4.44444H3.94444V20.5V36.0556V36.5556H4.44444H35.5556H36.0556V36.0556V20.5ZM36.0556 9.38889V8.88889H35.5556H4.44444H3.94444V9.38889V16.0556V16.5556H4.44444H35.5556H36.0556V16.0556V9.38889Z" fill="#121212" stroke="#121212"/>
            </svg>
            Додати нову подію у календар</div>
          <div className="quick-card">
            <svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.1111 4.72228V18.0556L26.6667 13.6112L22.2222 18.0556V4.72228H13.3333V40.2778H35.5556V4.72228H31.1111ZM0 11.3889V6.9445H4.44444V4.72228C4.44444 3.54354 4.9127 2.41307 5.74619 1.57958C6.57969 0.746084 7.71015 0.277832 8.88889 0.277832H35.5556C37.8889 0.277832 40 2.38894 40 4.72228V40.2778C40 42.6112 37.8889 44.7223 35.5556 44.7223H8.88889C6.55556 44.7223 4.44444 42.6112 4.44444 40.2778V38.0556H0V33.6112H4.44444V24.7223H0V20.2778H4.44444V11.3889H0ZM4.44444 6.9445V11.3889H8.88889V6.9445H4.44444ZM4.44444 38.0556H8.88889V33.6112H4.44444V38.0556ZM4.44444 24.7223H8.88889V20.2778H4.44444V24.7223Z" fill="#121212"/>
            </svg>
            Додати інше</div>
        </div>
      </div>

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onNoteAdded={fetchNotes}
      />
    </div>
  );
};

export default HomePage;
