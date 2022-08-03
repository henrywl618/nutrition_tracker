import React, { useEffect, useState } from "react";
import DiaryForm from "./DiaryForm";
import axios from "axios";

const Diary = ({userId})=>{

    let [viewDiary, setViewDiary] = useState("");
    let [response, setResponse] = useState(null);

    useEffect(()=>{
        const fetchData = async ()=>{
            const resp = await axios({method:'get',
                                            url:'http://127.0.0.1:5000/diary',
                                            params:{userId:userId}
                                        })
            setResponse(resp.data);
        };
        fetchData();

    },[]);

    return(
        <>  
            <ul>
                <h4>Daily Food Diaries</h4>
                {response.map((diary)=>{
                    return <li><a href={`http://127.0.0.1:5000/diary/${diary.id}`}>{diary.date}</a></li>
                })}
            </ul>
            <DiaryForm />
        </>
    );
}

export default Diary;