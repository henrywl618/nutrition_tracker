import React, {useEffect, useState} from "react";
import SearchForm from "./SearchForm";
import QuantitySelector from "./QuantitySelector";
import axios from "axios";
import "./DiaryForm.css";

const DiaryForm = ({toggleForm})=>{
    let [entries, setEntries] = useState([])
    let [input, setInput] = useState("");
    const emptyResults = {common:[],branded:[]};
    let [results, setResults] = useState(emptyResults);
    let [date, setDate] = useState("");
    let [calorie, setCalorie] = useState(2000);

    //Click handler for the search results. 
    //fooditem parameter is an object containing food data from NutritionIX API for the corresponding search result we clicked on.
    //A seperate api call needs to be made to get nutrition data (calories) for the specific food item. NutritionIX API requires seperate API endpoints for common food items vs branded food items. Branded food items need to be searched using nix_item_id and common food items can be searched using food_name.
    const addEntry = async (fooditem)=>{
        console.log(fooditem)
        console.log(fooditem.nix_item_id)
        //Determine if fooditem is branded vs common so we can make the appropiate API call. Fooditem.nix_item_id is undefined for common food items 
        if(fooditem.nix_item_id){
            try{
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
                                    qty:1
                                    }
                setEntries((currentEntries)=>{
                    const copy = [...currentEntries, newEntry];
                    return copy
                });
                //Reset search input after clicking on a result.
                setInput("");
                setResults(emptyResults);

            }
            catch(error){
                console.log(error)
            }

        }else{
            try{
                const response = await axios({ method:"get",
                                                url: "http://127.0.0.1:5000/nutrition/common",
                                                params: {food_name : fooditem.food_name},
                                            })
                const item=response.data 
                const newEntry = {food_name: item.food_name,
                                calorie: Math.round(item.nf_calories),
                                image: item.photo.thumb,
                                isBrand: "FALSE",
                                qty:1,
                                }
                setEntries((currentEntries)=>{
                const copy = [...currentEntries, newEntry];
                return copy
                });
                //Reset search input after clicking on a result.    
                setInput(""); 
                setResults(emptyResults); 
            }
            catch(error){
                console.log(error)
            }
                             
        }
    }

    const deleteEntry = (index)=>{
        setEntries((currentEntries)=>{
            //Make a copy of the current entries and remove entry at the passed in index. Update the state to rerender entries.-
            const copy = [...currentEntries];
            copy.splice(index,1);
            return copy

        });
    };

    const changeQty = (operation,index)=>{
        //Decrements or increments the quantity for an entry line
        if(operation ==='inc'){
            let new_qty = entries[index].qty + 1
            setEntries((e)=>{
                const copy = [...e]
                copy[index].qty = new_qty
                return copy
            })
        }
        else if(operation ==='dec'){
            //Prevent decrementing below 1
            let new_qty = entries[index].qty - 1 <=0 ? 1 : entries[index].qty - 1
            setEntries((e)=>{
                const copy = [...e]
                copy[index].qty = new_qty
                return copy
            })
        }
    }

    const changeDate = (e)=>{
        //Handles form changes for Date input
        setDate(e.target.value)
    };

    const changeCalorie = (e)=>{
        //Handles form changes for Calorie input
        setCalorie(e.target.value)
    };

    const createDiary = async ()=>{
        //Submits a post request to the backend server with entry data to create a new Diary and corresponding entries in the database.
        const json = JSON.stringify({entries:[...entries],date:date,calorie_goal:calorie,user_id:4});
        try{
            const response = await axios({method:'post',
                                          url:"http://127.0.0.1:5000/diary",
                                          headers:{"Content-Type":"application/json"},
                                          data:json})
            //Hide the form on successful submission
            if(response.data.success === true){
                toggleForm();
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <SearchForm addEntry={addEntry} setInput={setInput} input={input} setResults={setResults} results={results} date={date} setDate={setDate}/>
            <label htmlFor="date">Date</label>
            <input type="date" id="date" value={date} onChange={changeDate}/>
            <label htmlFor="calorie">Set Calorie Goal</label>
            <input type="number" id="calorie" value={calorie} onChange={changeCalorie}></input>
            <ul>
                {entries.map((entry,idx)=>{
                return <li className="Diary-entryline">
                         {entry.food_name}  
                         Calories:{entry.calorie*entry.qty} 
                         <img src={entry.image} className="Diary-image"></img> 
                         <QuantitySelector changeQty={changeQty} index={idx} qty={entry.qty}/> 
                         <button onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></button>
                       </li>
                })}
            </ul>
            <button onClick={createDiary}>Submit Diary</button>
        </div>
    )
};

export default DiaryForm;