import React, { useEffect, useState } from "react";
import DiaryForm from "./DiaryForm";
import axios from "axios";
import { useToggleBool } from "./hooks";
import "./Diary.css";
import DiaryView from "./DiaryView";

const Diary = ({userId})=>{

    // let [viewDiary, setViewDiary] = useState("");
    let [response, setResponse] = useState(null);
    let [showForm, toggleForm] = useToggleBool(false);
    let [showDiary, setShowDiary] = useState(false);
    let [viewingDiaryId, setViewingDiaryId] = useState(null);
    let [isLoading, setIsLoading] = useState(true);                                     

    const viewForm = ()=>{
        if(showForm === false){
            toggleForm();
            setShowDiary(false);
            setViewingDiaryId(null);
        } 
    }

    const viewDiary = (boolean, diaryId)=>{
        // Click handler for selecting a diary to view
        setShowDiary(boolean);
        setViewingDiaryId(diaryId);
        setIsLoading(true);

        if(showForm) toggleForm();
    };

    useEffect(()=>{
        const fetchData = async ()=>{
            const resp = await axios({method:'get',
                                            url:'http://127.0.0.1:5000/diary',
                                            params:{userId:userId}
                                        })
            setResponse(resp.data);
        };
        fetchData();

    },[showForm]);

    return(
        <>  
            <ul className="Diary-list">
                <h4>Daily Food Diaries</h4>
                <button onClick={viewForm}>Create a new diary</button>
                {response && response.map((diary)=>{
                    return <li><a onClick={()=>viewDiary(true,diary.id)}>{diary.date}</a></li>
                })}
            </ul>
            {showForm && <DiaryForm toggleForm={toggleForm}/>}
            {showDiary && <DiaryView setShowDiary={setShowDiary} diaryId={viewingDiaryId} isLoading={isLoading} setIsLoading={setIsLoading}/>}
        </>
    );
}

export default Diary;