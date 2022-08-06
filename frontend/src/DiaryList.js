import React from "react";

const DiaryList = ({response, viewForm, viewDiary, deleteDiary})=>{

    return(
        <ul className="Diary-list">
            <h4>Daily Food Diaries</h4>
            <button onClick={viewForm}>Create a new diary</button>
            {response && response.map((diary)=>{
                return <li>
                        <a onClick={()=>viewDiary(true,diary.id)}>{diary.date}</a>
                        <button onClick={()=>deleteDiary(diary.id)}><i className="fa-solid fa-trash-can"></i></button>
                    </li>
            })}
        </ul>
    )
};

export default DiaryList;