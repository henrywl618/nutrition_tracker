import React, { useEffect,useState } from "react";
import SearchForm from "./SearchForm";
import axios from "axios";
import EntryLines from "./EntryLines";

const MealView = ({viewMealList,mealId, isLoading, setIsLoading})=>{
    let [entries, setEntries] = useState([])
    let [input, setInput] = useState("");
    const emptyResults = {common:[],branded:[]};
    let [results, setResults] = useState(emptyResults);
    let [date, setDate] = useState("");
    let [calorie, setCalorie] = useState(2000);
    let [saving, setSaving] = useState(false);
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
                setEntryAdded(true)

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
                                meal:meal
                                }
                setEntries((currentEntries)=>{
                const copy = [...currentEntries, newEntry];
                return copy
                });
                //Reset search input after clicking on a result.    
                setInput(""); 
                setResults(emptyResults);
                setEntryAdded(true) 
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


    const editMeal = async ()=>{
        //Submits a post request to the backend server with entry data to create a new Meal and corresponding entries in the database.
        const json = JSON.stringify({entries:[...entries],meal_id:mealId});
        setSaving(true)
        console.log(saving)
        try{
            const response = await axios({method:'put',
                                          url:`http://127.0.0.1:5000/meal/${mealId}`,
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
        const getMeal = async()=>{
            try{
                const resp = await axios.get(`http://127.0.0.1:5000/meal/${mealId}`, 
                                            {headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}})
                const meal = resp.data
                setDate(meal.date)
                setCalorie(meal.calorie_goal)
                setEntries(meal.entries)
                setTimeout(()=>setIsLoading(false),100);
            }
            catch(error){
                console.log(error)
            }
        };
        getMeal();
    },[mealId,isLoading]);

    if (isLoading){
        return (
            <i className="fa-solid fa-spinner"></i>
        )
    }else{
        return (
            <div>
                <h4>Meal Plan</h4>
                <p>{date}</p>
                <p>Total Calories: {entries.reduce((previousTotal,currentEntry)=>previousTotal+(currentEntry.calorie*currentEntry.quantity),0)}</p>

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

                <EntryLines entries={entries} deleteEntry={deleteEntry} changeQty={changeQty} setShowSearch={setShowSearch} handleShowModal={handleShowModal}/>

                <button onClick={editMeal}>{saving ? <i className="fa-solid fa-spinner"></i> : "Save Changes"}</button>
                <button onClick={viewMealList}>Go Back</button>
            </div>
        )
    }
};

export default MealView;