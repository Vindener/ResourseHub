import React, { useState, useEffect } from "react";
import notesData from "../data/notes.json"; // Завантаження даних нотаток
import CalendarWithNotes from "../components/CalendarWithNotes";

const HomePage = () => {

    return (
        <>
        <div style={{width:"310px", height:"255px"}}>
            <div style={{display:"flex",flexDirection:"row"}}>
                <div style={{backgroundColor:"#CBA8E1", margin:"20px",width:"320px",height:"140px",borderRadius:"30px",padding:"20px"}}>
                    Прогрес виконання справ
                </div>
                <div style={{backgroundColor:"#BFE0A5", margin:"20px",width:"320px",height:"140px",borderRadius:"30px",padding:"20px"}}>
                    Тузік
                </div>
            </div>
            <CalendarWithNotes/>
        </div>
        </>
    )

}
export default HomePage;
