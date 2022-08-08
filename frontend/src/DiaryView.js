import React, { useEffect,useState } from "react";
import SearchForm from "./SearchForm";
import QuantitySelector from "./QuantitySelector";
import axios from "axios";
import "./DiaryView.css";

const DiaryView = ({viewDiaryList,diaryId, isLoading, setIsLoading})=>{
    let [entries, setEntries] = useState([])
    let [input, setInput] = useState("");
    const emptyResults = {common:[],branded:[]};
    let [results, setResults] = useState(emptyResults);
    let [date, setDate] = useState("");
    let [calorie, setCalorie] = useState(2000);
    let [saving, setSaving] = useState(false);


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
                                    quantity:1
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
                                quantity:1,
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
            let new_qty = entries[index].quantity + 1
            setEntries((e)=>{
                const copy = [...e]
                copy[index].quantity = new_qty
                return copy
            })
        }
        else if(operation ==='dec'){
            //Prevent decrementing below 1
            let new_qty = entries[index].quantity - 1 <=0 ? 1 : entries[index].quantity - 1
            setEntries((e)=>{
                const copy = [...e]
                copy[index].quantity = new_qty
                return copy
            })
        }
    }


    const editDiary = async ()=>{
        //Submits a post request to the backend server with entry data to create a new Diary and corresponding entries in the database.
        const json = JSON.stringify({entries:[...entries],diary_id:diaryId});
        setSaving(true)
        console.log(saving)
        try{
            const response = await axios({method:'put',
                                          url:`http://127.0.0.1:5000/diary/${diaryId}`,
                                          headers:{"Content-Type":"application/json",                                             
                                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
                                          data:json})
            const entries = response.data.entries;
            setSaving(false);
            console.log(saving)
            setEntries([...entries]);

        }
        catch(error){
            setSaving(false);
            console.log(error)
        }
    }

    useEffect(()=>{
        const getDiary = async()=>{
            try{
                const resp = await axios.get(`http://127.0.0.1:5000/diary/${diaryId}`, 
                                            {headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}})
                const diary = resp.data
                setDate(diary.date)
                setCalorie(diary.calorie_goal)
                setEntries(diary.entries)
                setTimeout(()=>setIsLoading(false),100);
            }
            catch(error){
                console.log(error)
            }
        };
        getDiary();
    },[diaryId,isLoading]);

    if (isLoading){
        return (
            <i className="fa-solid fa-spinner"></i>
        )
    }else{
        return (
            <div>
                <h4>Food Diary</h4>
                <p>{date}</p>
                <p>Calorie Goal: {calorie}</p>
                <p>Calories to goal: {calorie-entries.reduce((previousTotal,currentEntry)=>previousTotal+(currentEntry.calorie*currentEntry.quantity),0)}</p>
                <SearchForm addEntry={addEntry} setInput={setInput} input={input} setResults={setResults} results={results} date={date} setDate={setDate}/>
                <ul>
                    {entries.map((entry,idx)=>{
                    return <li className="DiaryView-entryline">
                            {entry.food_name}  
                            Calories:{entry.calorie*entry.quantity} 
                            <img src={entry.image} className="DiaryView-image"></img> 
                            <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                            <button onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></button>
                        </li>
                    })}
                </ul>
                <button onClick={editDiary}>{saving ? <i className="fa-solid fa-spinner"></i> : "Save Changes"}</button>
                <button onClick={viewDiaryList}>Go Back</button>
            </div>
        )
    }
};

export default DiaryView;