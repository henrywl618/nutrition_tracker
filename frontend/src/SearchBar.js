import axios, { Axios } from "axios";
import React, {useState} from "react";

const SearchBar = ({setResults, setInput, input, entryAdded, setEntryAdded})=>{

    const handleChange = (e)=>{
        if(entryAdded){
            setEntryAdded(false)
        }
        setInput(e.target.value);
    };

    const search = async (e)=>{
        e.preventDefault();
        if(input){
            const response = await axios({
                method: 'get',
                url: 'http://127.0.0.1:5000/search',
                params:{query:input}
            })
            setResults(response.data)
        }
    };

    return (
        <form>
            <input type="text" placeholder="Search for a food item" list="results" onChange={handleChange} value={input}></input>
            <button onClick={search}><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
    )
};

export default SearchBar;