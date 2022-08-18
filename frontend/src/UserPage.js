import React, { useEffect, useState } from "react";
import axios from "axios";
import { hostURL } from "./App";

const UserPage = ()=>{
    let [data, setData] = useState(null);

    useEffect(()=>{
        const fetchData = async ()=>{
            const resp = await axios({method:'get',
                                    url:`${hostURL}/user`,
                                    headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}
                                })
            setData(()=>({...resp.data}));
        };

        fetchData();

    },[])

    return(
        <>
        {data &&
        <>
        <p>Username: {data.user.username}</p>
        <p>Email: {data.user.email}</p>
        </>
        }
        </>
    )
};

export default UserPage;