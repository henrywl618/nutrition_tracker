import React, { useEffect, useState } from "react";
import MealForm from "./MealForm";
import axios from "axios";
import { useToggleBool } from "./hooks";
import MealView from "./MealView";
import MealList from "./MealList";

const Meal = ()=>{

    let [showMealList, setShowMealList] = useState(true);
    let [response, setResponse] = useState(null);
    let [showForm, toggleForm] = useToggleBool(false);
    let [showMeal, setShowMeal] = useState(false);
    let [viewingMealId, setViewingMealId] = useState(null);
    let [isLoading, setIsLoading] = useState(true);                                     

    const viewForm = ()=>{
        if(showForm === false){
            toggleForm();
            setShowMeal(false);
            setViewingMealId(null);
            setShowMealList(false);
        } 
    }

    const viewMeal = (boolean, mealId)=>{
        // Click handler for selecting a meal to view
        setShowMeal(boolean);
        setViewingMealId(mealId);
        setIsLoading(true);
        setShowMealList(false);

        if(showForm) toggleForm();
    };

    const viewMealList = ()=>{
        // Click handler for Go Back button on MealView and MealForm components
        setShowMeal(false);
        setViewingMealId(null);
        setShowMealList(true);
        if(showForm) toggleForm();
    };

    const deleteMeal = async (mealId)=>{
        try{
            const resp = await axios({method:'delete',
                                      url:`http://127.0.0.1:5000/meal/${mealId}`,
                                      headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`},})
            setResponse(resp.data);
        }   
        catch(error){
            console.log(error)
        }
    };

    useEffect(()=>{
        const fetchData = async ()=>{
            const resp = await axios({method:'get',
                                            url:'http://127.0.0.1:5000/meal',
                                            headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}
                                        })
            setResponse(resp.data);
        };
        fetchData();

    },[showForm]);

    return(
        <div className="Meal">  
            {showMealList && <MealList response={response} viewForm={viewForm} viewMeal={viewMeal} deleteMeal={deleteMeal}/>}
            {showForm && <MealForm toggleForm={toggleForm} viewMealList={viewMealList}/>}
            {showMeal && <MealView viewMealList={viewMealList} mealId={viewingMealId} isLoading={isLoading} setIsLoading={setIsLoading}/>}
        </div>
    );
}

export default Meal;