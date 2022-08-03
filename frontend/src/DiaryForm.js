import React, {useEffect, useState} from "react";
import SearchForm from "./SearchForm";
import axios from "axios";
import "./DiaryForm.css";

const DiaryForm = ()=>{
    let [entries, setEntries] = useState([])
    let [input, setInput] = useState("");
    const emptyResults = {common:[],branded:[]};
    let [results, setResults] = useState(emptyResults);

    //Click handler for the search results. 
    //fooditem parameter is an object containing food data from NutritionIX API for the corresponding search result we clicked on.
    //A seperate api call needs to be made to get nutrition data (calories) for the specific food item. NutritionIX API requires seperate API endpoints for common food items vs branded food items. Branded food items need to be searched using nix_item_id and common food items can be searched using food_name.
    const addEntry = async (fooditem)=>{
        console.log(fooditem)
        console.log(fooditem.nix_item_id)
        //Determine if fooditem is branded vs common so we can make the appropiate API call. Fooditem.nix_item_id is undefined for common food items 
        if(fooditem.nix_item_id){
            const response = await axios({ method:"get",
                                           url: "http://127.0.0.1:5000/nutrition/brand",
                                           params: {nix_item_id : fooditem.nix_item_id},
                                        })
            const item=response.data                            
            const newEntry = {food_name: item.food_name,
                              calorie: Math.round(item.nf_calories),
                              image: item.photo.thumb,
                              brand_item_id: item.nix_item_id,
                              isBrand: "TRUE",
                              }
            setEntries((currentEntries)=>{
                const copy = [...currentEntries, newEntry];
                return copy
            });
            //Reset search input after clicking on a result.
            setInput("");
            setResults(emptyResults);

        }else{
            const response = await axios({ method:"get",
                                           url: "http://127.0.0.1:5000/nutrition/common",
                                           params: {food_name : fooditem.food_name},
                                        })
            const item=response.data 
            const newEntry = {food_name: item.food_name,
                                calorie: Math.round(item.nf_calories),
                                image: item.photo.thumb,
                                isBrand: "FALSE",
                                }
            setEntries((currentEntries)=>{
                const copy = [...currentEntries, newEntry];
                return copy
            });
            //Reset search input after clicking on a result.    
            setInput(""); 
            setResults(emptyResults);                              
        }
    }

    // let entryline

    // useEffect(()=>{
    //     //Render diary entries if entries is not empty
    //     if(entries[0]){
            
    //         entryline = entries.map((entry)=>{
    //             return <li>
    //                      {entry.food_name}  Calories:{entry.calorie} <img src={entry.image}></img>
    //                    </li>
    //         })
    //     }
    // },[entries]);
    // console.log(entryline)
    return (
        <div>
            <SearchForm addEntry={addEntry} setInput={setInput} input={input} setResults={setResults} results={results}/>
            <ul>
                {entries.map((entry)=>{
                return <li className="Diary-entryline">
                         {entry.food_name}  Calories:{entry.calorie} <img src={entry.image} className="Diary-image"></img>
                       </li>
                })}
            </ul>
        </div>
    )
};

export default DiaryForm;