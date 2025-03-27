import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Check } from "lucide-react";
import "./Plan.css"

const PlanList = () => {
  const today = new Date().toISOString().split("T")[0];
  const currentWeek = new Date().getWeek();
  const currentMonth = new Date().getMonth();

  const [user, setUser] = useState(null);
  const [dailyPlans, setDailyPlans] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [monthlyPlans, setMonthlyPlans] = useState([]);
  const [newPlan, setNewPlan] = useState("");
  const [isAdding, setIsAdding] = useState({ day: false, week: false, month: false });
  const [isEditing, setIsEditing] = useState({ day: false, week: false, month: false });
  const [editedPlans, setEditedPlans] = useState({});
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/plans/${user.id}`)
        .then((response) => {
          const plans = response.data;
          setDailyPlans(plans.filter((plan) => plan.type === "day" && adjustToLocalDate(plan.assigned_date) === today));
          setWeeklyPlans(plans.filter((plan) => plan.type === "week" && new Date(plan.assigned_date).getWeek() === currentWeek));
          setMonthlyPlans(plans.filter((plan) => plan.type === "month" && new Date(plan.assigned_date).getMonth() === currentMonth));
        })
        .catch((error) => console.error("Помилка завантаження планів:", error));
    }
  }, [user]);

  const addPlan = (type, setPlans) => {
    if (newPlan.trim() !== "" && user?.id) {
      const todayFormatted = adjustToLocalDate(new Date());
      const newPlanObj = { title: newPlan, user_id: user.id, type, assigned_date: todayFormatted };
      axios.post("http://localhost:5000/plans", newPlanObj).then((response) => {
        setPlans((prevPlans) => [...prevPlans, { ...newPlanObj, id: response.data.id }]);
        setNewPlan("");
        setIsAdding((prev) => ({ ...prev, [type]: false }));
      });
    }
  };

  const updatePlan = (id, title) => {
    axios.put(`http://localhost:5000/plans/${id}`, { title })
      .then(() => {
        setDailyPlans((prevPlans) => prevPlans.map(plan => plan.id === id ? { ...plan, title } : plan));
        setWeeklyPlans((prevPlans) => prevPlans.map(plan => plan.id === id ? { ...plan, title } : plan));
        setMonthlyPlans((prevPlans) => prevPlans.map(plan => plan.id === id ? { ...plan, title } : plan));
        setEditedPlans((prev) => ({ ...prev, [id]: undefined }));
      })
      .catch(error => console.error("Помилка оновлення плану:", error));
  };


const toggleDone  = (id, updatedFields) => {
  axios.put(`http://localhost:5000/plans/done/${id}`, updatedFields)
    .then((response) => {
      setDailyPlans((prevPlans) => prevPlans.map(plan =>
        plan.id === id ? { ...plan, ...updatedFields } : plan
      ));
      setWeeklyPlans((prevPlans) => prevPlans.map(plan =>
        plan.id === id ? { ...plan, ...updatedFields } : plan
      ));
      setMonthlyPlans((prevPlans) => prevPlans.map(plan =>
        plan.id === id ? { ...plan, ...updatedFields } : plan
      ));
    })
    .catch(error => console.error("Помилка оновлення плану:", error));
};

  const deletePlan = (id) => {
    axios.delete(`http://localhost:5000/plans/${id}`)
      .then(() => {
        setDailyPlans((prevPlans) => prevPlans.filter(plan => plan.id !== id));
        setWeeklyPlans((prevPlans) => prevPlans.filter(plan => plan.id !== id));
        setMonthlyPlans((prevPlans) => prevPlans.filter(plan => plan.id !== id));
      })
      .catch(error => console.error("Помилка видалення плану:", error));
  };

  const formattedTodayDate = new Date().toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="plan-container">
      <div className="plan-header-container">
        <h2 className="plan-header">{formattedTodayDate}</h2>
      </div>
      <PlanSection title="Плани на день" plans={dailyPlans} isAdding={isAdding.day} setIsAdding={() => setIsAdding({ ...isAdding, day: true })} isEditing={isEditing.day} setIsEditing={() => setIsEditing({ ...isEditing, day: !isEditing.day })} newPlan={newPlan} setNewPlan={setNewPlan} addPlan={() => addPlan("day", setDailyPlans)} updatePlan={updatePlan} editedPlans={editedPlans} setEditedPlans={setEditedPlans}  toggleDone={toggleDone} deletePlan={deletePlan} />
      <PlanSection title="Плани на тиждень" plans={weeklyPlans} isAdding={isAdding.week} setIsAdding={() => setIsAdding({ ...isAdding, week: true })} isEditing={isEditing.week} setIsEditing={() => setIsEditing({ ...isEditing, week: !isEditing.week })} newPlan={newPlan} setNewPlan={setNewPlan} addPlan={() => addPlan("week", setWeeklyPlans)} updatePlan={updatePlan} editedPlans={editedPlans} setEditedPlans={setEditedPlans}  toggleDone={toggleDone} deletePlan={deletePlan} />
      <PlanSection title="Плани на місяць" plans={monthlyPlans} isAdding={isAdding.month} setIsAdding={() => setIsAdding({ ...isAdding, month: true })} isEditing={isEditing.month} setIsEditing={() => setIsEditing({ ...isEditing, month: !isEditing.month })} newPlan={newPlan} setNewPlan={setNewPlan} addPlan={() => addPlan("month", setMonthlyPlans)} updatePlan={updatePlan} editedPlans={editedPlans} setEditedPlans={setEditedPlans} toggleDone={toggleDone} deletePlan={deletePlan} />
    </div>
  );
};

const PlanSection = ({ title, plans, isAdding, setIsAdding, isEditing, setIsEditing, newPlan, setNewPlan, addPlan, updatePlan, editedPlans, setEditedPlans,toggleDone,deletePlan }) => (
  <div className="bg-white p-4 shadow-lg rounded-xl mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="plan-subheader">{title}
        <button onClick={setIsAdding} className="plan-edit">+</button>
        <button onClick={setIsEditing} className="plan-edit">{isEditing ? <Check /> : <Pencil />}</button>
      </h3>    
    </div>
    {plans.length > 0 ? (
      <dl>
        {plans.map((plan) => (
          <dt key={plan.id} className="plan-edit-container">
            <input
              type="checkbox"
              checked={plan.done || false}
              onChange={() => toggleDone(plan.id, { done: !plan.done })}
              styles={{}}
            />

            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedPlans[plan.id] ?? plan.title}
                  onChange={(e) => setEditedPlans((prev) => ({ ...prev, [plan.id]: e.target.value }))}
                  className="plan-input"
                  onBlur={() => updatePlan(plan.id, editedPlans[plan.id] ?? plan.title)}
                />
                <button onClick={() => deletePlan(plan.id)} className="plan-delete">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.875 11.25C1.53125 11.25 1.23708 11.1277 0.9925 10.8831C0.747917 10.6385 0.625417 10.3442 0.625 10V1.875H0V0.625H3.125V0H6.875V0.625H10V1.875H9.375V10C9.375 10.3438 9.25271 10.6381 9.00813 10.8831C8.76354 11.1281 8.46917 11.2504 8.125 11.25H1.875ZM3.125 8.75H4.375V3.125H3.125V8.75ZM5.625 8.75H6.875V3.125H5.625V8.75Z" fill="#24418A"/>
                  </svg>

                </button>
              </> 
            ) : (
              <strong className={plan.done ? "line-through text-gray-500" : ""} style={{ textDecoration: plan.done ? 'line-through' : 'none' }}>{plan.title}</strong>
            )}
          </dt>

        ))}
      </dl>
    ) : (
      <p className="text-gray-500">Немає запланованих подій.</p>
    )}
    {isAdding && (
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={newPlan}
          onChange={(e) => setNewPlan(e.target.value)}
          className="border p-1 rounded w-full"
          placeholder="Введіть новий план"
        />
        <button onClick={addPlan} className="text-blue-500 text-lg">✔</button>
      </div>
    )}
  </div>
);

const adjustToLocalDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

Date.prototype.getWeek = function () {
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
  const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export default PlanList;
