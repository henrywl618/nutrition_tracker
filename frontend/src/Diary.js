import React, {useState} from "react";
import SearchForm from "./SearchForm";
import axios from "axios";

const Diary = ()=>{
    let [entries, setEntries] = useState([])

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
            console.log(response.data)
        }else{
            const response = await axios({ method:"get",
                                           url: "http://127.0.0.1:5000/nutrition/common",
                                           params: {food_name : fooditem.food_name},
                                        })
            console.log(response.data)
        }
    }


    return (
        <div>
            <SearchForm addEntry={addEntry}/>
            <ul>
                {}
            </ul>
        </div>
    )
};

export default Diary;