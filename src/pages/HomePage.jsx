import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarWithNotes from "../components/calendar/CalendarForHome";
import PlanListForHome from "../components/Plan/PlanListForHome";
import WeeklyProgress from "../components/Plan/WeeklyProgress";
import SpoonSystem from "../components/Spoon/SpoonSystem";
import AddNoteModal from "../components/Notes/AddNoteModal";
import PetSummaryCard from "../components/Tamagotchi/PetSummaryCard";
import "./Styles.css";

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
  
  const handleFocus = () => {
        navigate("/selfhelp/focus");
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
            <path d="M28.8887 1C29.2579 1.00005 29.6162 1.11839 29.9111 1.33594L30.0332 1.43555C30.3089 1.68077 30.4973 2.00697 30.5732 2.36523L30.5986 2.52051L30.6113 2.73535V5.44434H35.5557C36.4886 5.44404 37.3894 5.77427 38.0996 6.37305L38.2393 6.49707C38.9232 7.13148 39.3585 7.9862 39.4717 8.9082L39.4902 9.09277L39.5 9.40527V36.0557L39.4961 36.2422C39.4554 37.1081 39.1301 37.9369 38.5713 38.5996L38.4482 38.7393C37.7725 39.4679 36.8462 39.9137 35.8555 39.9893L35.5391 40H4.44434L4.25781 39.9961C3.39188 39.9554 2.56314 39.6301 1.90039 39.0713L1.76074 38.9482C1.07678 38.314 0.641689 37.459 0.52832 36.5371L0.509766 36.3516L0.5 36.0391V9.38867L0.503906 9.20215C0.544607 8.33622 0.869886 7.50746 1.42871 6.84473L1.55176 6.70508C2.22727 5.97662 3.15311 5.52987 4.14355 5.4541L4.46094 5.44434H9.38867V2.72266L9.39648 2.55957C9.42779 2.23441 9.55134 1.92477 9.75195 1.66699L9.8584 1.54199C10.1222 1.26261 10.471 1.08075 10.8477 1.02246L11.0098 1.00586C11.3931 0.983354 11.7719 1.08908 12.0859 1.30469L12.2168 1.4043C12.5502 1.68352 12.7651 2.07852 12.8193 2.50977L12.833 2.73535V5.44434H27.167V2.72266C27.167 2.32303 27.3056 1.93731 27.5566 1.63086L27.6709 1.50488C27.9535 1.22227 28.3245 1.04793 28.7188 1.00879L28.8887 1ZM3.94434 36.5557H36.0557V20H3.94434V36.5557ZM3.94434 16.5557H36.0557V8.88867H3.94434V16.5557Z" fill="#121212" stroke="#121212"/>
            </svg>
            Додати нову подію у календар</div>
          <div className="quick-card" onClick={handleFocus}>
            <svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.1111 4.72228V18.0556L26.6667 13.6112L22.2222 18.0556V4.72228H13.3333V40.2778H35.5556V4.72228H31.1111ZM0 11.3889V6.9445H4.44444V4.72228C4.44444 3.54354 4.9127 2.41307 5.74619 1.57958C6.57969 0.746084 7.71015 0.277832 8.88889 0.277832H35.5556C37.8889 0.277832 40 2.38894 40 4.72228V40.2778C40 42.6112 37.8889 44.7223 35.5556 44.7223H8.88889C6.55556 44.7223 4.44444 42.6112 4.44444 40.2778V38.0556H0V33.6112H4.44444V24.7223H0V20.2778H4.44444V11.3889H0ZM4.44444 6.9445V11.3889H8.88889V6.9445H4.44444ZM4.44444 38.0556H8.88889V33.6112H4.44444V38.0556ZM4.44444 24.7223H8.88889V20.2778H4.44444V24.7223Z" fill="#121212"/>
            </svg>
            Фокус-сесія</div>
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
