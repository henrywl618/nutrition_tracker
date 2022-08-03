import axios, { Axios } from "axios";
import React, {useState} from "react";

const SearchBar = ({setResults, setInput, input})=>{

    const handleChange = async (e)=>{
        setInput(e.target.value);
        if(e.target.value){
            const response = await axios({
                method: 'get',
                url: 'http://127.0.0.1:5000/search',
                params:{query:e.target.value}
            })
            console.log(response.data)
            setResults(response.data)
        }

    };

    return (
        <>
            <input type="text" placeholder="Search..." list="results" onChange={handleChange} value={input}></input>
        </>

    )
};

export default SearchBar;