import React, {useEffect, useState} from "react";
import SearchForm from "./SearchForm";
import QuantitySelector from "./QuantitySelector";
import axios from "axios";
import EntryLines from "./EntryLines";
import { Button } from "react-bootstrap";
import "./DiaryForm.css";

const DiaryForm = ({toggleForm, viewDiaryList})=>{
    let [entries, setEntries] = useState([])
    let [input, setInput] = useState("");
    const emptyResults = {common:[],branded:[]};
    let [results, setResults] = useState(emptyResults);
    let [date, setDate] = useState("");
    let [calorie, setCalorie] = useState(2000);
    let [error, setError] = useState("");
    let [showSearch, setShowSearch] = useState({show:false,
                                                meal:""});
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const [entryAdded, setEntryAdded] = useState(false);

    //Click handler for the search results. 
    //fooditem parameter is an object containing food data from NutritionIX API for the corresponding search result we clicked on.
    //A seperate api call needs to be made to get nutrition data (calories) for the specific food item. NutritionIX API requires seperate API endpoints for common food items vs branded food items. Branded food items need to be searched using nix_item_id and common food items can be searched using food_name.
    const addEntry = async (fooditem,meal)=>{
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
                                    fat: Math.round(item.nf_total_fat),
                                    carbs: Math.round(item.nf_total_carbohydrate),
                                    protein: Math.round(item.nf_protein),
                                    serving_size:item.serving_unit,
                                    image: item.photo.thumb,
                                    brand_item_id: item.nix_item_id,
                                    isBrand: "TRUE",
                                    quantity:1,
                                    meal:meal
                                    }
                setEntries((currentEntries)=>{
                    const copy = [...currentEntries, newEntry];
                    return copy
                });
                //Reset search input after clicking on a result.
                setInput("");
                setResults(emptyResults);
                setEntryAdded(true);

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
                                fat: Math.round(item.nf_total_fat),
                                carbs: Math.round(item.nf_total_carbohydrate),
                                protein: Math.round(item.nf_protein),
                                serving_size:item.serving_unit,
                                image: item.photo.thumb,
                                isBrand: "FALSE",
                                quantity:1,
                                meal:meal,
                                }
                setEntries((currentEntries)=>{
                const copy = [...currentEntries, newEntry];
                return copy
                });
                //Reset search input after clicking on a result.    
                setInput(""); 
                setResults(emptyResults);
                setEntryAdded(true); 
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
        setError("");
        const json = JSON.stringify({entries:[...entries],date:date,calorie_goal:calorie,user_id:4});
        try{
            const response = await axios({method:'post',
                                          url:"http://127.0.0.1:5000/diary",
                                          headers:{"Content-Type":"application/json",
                                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
                                          data:json})
            //Hide the form on successful submission
            if(response.data.success === true){
                viewDiaryList();
            }
            else if(response.data.msg === "Please enter a valid date"){
                setError("Please enter a date")
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <h2>Create a new diary</h2>
            <p className="text-danger my-3">{error}</p>
            <div className="container">
                <form className="row mb-3 DiaryForm-inputwrapper justify-content-center">
                    <div className="col-md-3">
                        <div>
                            <label htmlFor="date" className="form-label">Date</label>
                        </div>
                        <div>
                            <input type="date" id="date" value={date} onChange={changeDate} className="form-control-sm mb-2"/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div>
                            <label htmlFor="calorie" className="form-label">Set Calorie Goal</label>
                        </div>
                        <div>
                            <input type="number" id="calorie" value={calorie} onChange={changeCalorie} className="form-control-sm mb-2"></input>
                        </div>
                    </div>
                </form>

            </div>


            <EntryLines entries={entries} deleteEntry={deleteEntry} changeQty={changeQty} setShowSearch={setShowSearch} handleShowModal={handleShowModal}/>

            <Button className="bluebutton mx-2 mb-5" onClick={createDiary}>Submit Diary</Button>
            <Button className="bluebutton mx-2 mb-5"onClick={viewDiaryList}>Go Back</Button>

            {showSearch.show && <SearchForm addEntry={addEntry} 
                                                   setInput={setInput} 
                                                   input={input} 
                                                   setResults={setResults} 
                                                   results={results} 
                                                   date={date} 
                                                   setDate={setDate} 
                                                   meal={showSearch.meal}
                                                   handleCloseModal={handleCloseModal}
                                                   showModal={showModal}
                                                   entryAdded={entryAdded}
                                                   setEntryAdded={setEntryAdded}/>}
        </div>
    )
};

export default DiaryForm;