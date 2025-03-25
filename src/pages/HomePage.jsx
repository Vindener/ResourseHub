import React, { useState, useEffect } from "react";
import notesData from "../data/notes.json"; // Завантаження даних нотаток
import CalendarWithNotes from "../components/calendar/CalendarForHome";
import "./Test.css"

const HomePage = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <>
        <div>
            <div class="container" >
                <div class="calendar-block">
                    <CalendarWithNotes />
                </div>
                <div class="today-block">
                    <div>
                        Сьогодні тут буде компонент з справами
                    </div>
                </div>
                <div class="progress-today-block">
                    <div >
                        Прогрес виконання справ на тиждень
                    </div>
                    <p>Молодець! Так тримати!</p>
                </div>
                <div class="tamagochi-block"> 
                    <div>
                        Ім'я з бази даних: {user ? user.pet_name : "Завантаження..."}
                    </div>
                </div>
                <div class="spoons-block">
                    <p>
                         На скільки ложок ви сьогодні себе відчуваєте?
                    </p>
                    <progress max="100" value="70" style={{width:"90%"}}/>
                    <p>
                        Вдалого дня! Не забудьте відпочити ще сьогодні)
                    </p>
                </div>
                <div class="fast-actions-block">
                    <h3>Швидкі дії</h3>
                    <div style={{display:"flex",flexDirection:"row", gap:"20px",alignItems:"center"}}>
                        <div>Додати нову нотатку</div>
                        <div>Додати нову подію</div>
                        <div>Додати новий пункт у плани</div>
                    </div>
                </div>
            </div>     
        </div>
        </>
    )

}
export default HomePage;
