import axios, { Axios } from "axios";
import React, {useState} from "react";

const SearchBar = ()=>{
    let [input, setInput] = useState("");
    let [results, setResults] = useState("");

    const handleChange = async (e)=>{
        setInput(e.target.value);
        const response = await axios({
                                       method: 'get',
                                       url: 'https://trackapi.nutritionix.com/v2/search/instant',
                                       headers:{'x-app-id':'cb1063ec',
                                               'x-app-key':'fe556ea31678a878f116c76bbd8da68e'},
                                       params:{query:e.target.value}
                               })
        console.log(response.data)
    };

    return (
        <>
            <input type="text" placeholder="Search..." onChange={handleChange} value={input}></input>
        </>

    )
};

export default SearchBar;