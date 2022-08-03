import React, { useEffect, useState } from "react";
import DiaryForm from "./DiaryForm";
import axios from "axios";
import { useToggleBool } from "./hooks";

const Diary = ({userId})=>{

    let [viewDiary, setViewDiary] = useState("");
    let [response, setResponse] = useState(null);
    let [showForm, toggleForm] = useToggleBool(false);

    const viewForm = ()=>{
        if(showForm === false) toggleForm()
    }

    useEffect(()=>{
        const fetchData = async ()=>{
            const resp = await axios({method:'get',
                                            url:'http://127.0.0.1:5000/diary',
                                            params:{userId:userId}
                                        })
            setResponse(resp.data);
            console.log(response)
        };
        fetchData();

    },[]);

    return(
        <>  
            <ul>
                <h4>Daily Food Diaries</h4>
                <button onClick={viewForm}>Create a new diary</button>
                {response && response.map((diary)=>{
                    return <li><a href={`http://127.0.0.1:5000/diary/${diary.id}`}>{diary.date}</a></li>
                })}
            </ul>
            {showForm && <DiaryForm />}
        </>
    );
}

export default Diary;