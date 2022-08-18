import React, { useEffect, useState } from "react";
import DiaryForm from "./DiaryForm";
import axios from "axios";
import { useToggleBool } from "./hooks";
import "./Diary.css";
import DiaryView from "./DiaryView";
import DiaryList from "./DiaryList";
import { hostURL } from "./App";

const Diary = ()=>{

    let [showDiaryList, setShowDiaryList] = useState(true);
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
            setShowDiaryList(false);
        } 
    }

    const viewDiary = (boolean, diaryId)=>{
        // Click handler for selecting a diary to view
        setShowDiary(boolean);
        setViewingDiaryId(diaryId);
        setIsLoading(true);
        setShowDiaryList(false);

        if(showForm) toggleForm();
    };

    const viewDiaryList = ()=>{
        // Click handler for Go Back button on DiaryView and DiaryForm components
        setShowDiary(false);
        setViewingDiaryId(null);
        setShowDiaryList(true);
        if(showForm) toggleForm();
    };

    const deleteDiary = async (diaryId)=>{
        try{
            const resp = await axios({method:'delete',
                                      url:`${hostURL}/diary/${diaryId}`,
                                      headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`},})
            setResponse(resp.data);
        }   
        catch(error){
            console.log(error)
        }
    };

    useEffect(()=>{
        const fetchData = async ()=>{
            const resp = await axios({method:'get',
                                            url:`${hostURL}/diary`,
                                            headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}
                                        })
            setResponse(resp.data);
        };
        fetchData();

    },[showForm,showDiaryList]);

    return(
        <div className="Diary">  
            {showDiaryList && <DiaryList response={response} viewForm={viewForm} viewDiary={viewDiary} deleteDiary={deleteDiary}/>}
            {showForm && <DiaryForm toggleForm={toggleForm} viewDiaryList={viewDiaryList}/>}
            {showDiary && <DiaryView viewDiaryList={viewDiaryList} diaryId={viewingDiaryId} isLoading={isLoading} setIsLoading={setIsLoading}/>}
        </div>
    );
}

export default Diary;