import React, { useState, useEffect } from "react";
import notesData from "../data/notes.json"; // Завантаження даних нотаток
import CalendarWithNotes from "../components/calendar/CalendarWithNotes";

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
        <div >
            <div style={{display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <div style={{backgroundColor:"#CBA8E1", margin:"20px",width:"320px",height:"140px",borderRadius:"30px",padding:"20px"}}>
                        Прогрес виконання справ
                    </div>
                    <div style={{ backgroundColor: "#BFE0A5", margin: "20px", width: "320px", height: "140px", borderRadius: "30px", padding: "20px" }}>
                    {user ? user.pet_name : "Завантаження..."}
                    </div>

                     <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
                        <div style={{width:"380px", backgroundColor:"#FFFAED", marginBottom:"20px"}}>
                            <CalendarWithNotes />
                        </div>
                        <div style={{width:"380px", backgroundColor:"#FFFAED"}}>
                            сьодні
                        </div>
                        </div>
                        
                </div>
<div style={{width:"50%", backgroundColor:"#F6D868", marginTop:"20px"}}>
                    На скільки ложок ви сьогодні себе відчуваєте?
            </div>
           

            </div>
            
          

            

            
        </div>
        </>
    )

}
export default HomePage;
