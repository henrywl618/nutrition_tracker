import React, { useEffect, useState } from "react";
import MealForm from "./MealForm";
import axios from "axios";
import { useToggleBool } from "./hooks";
import MealEdit from "./MealEdit";
import MealList from "./MealList";
import { hostURL } from "./App";

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

    const editMeal = (mealId)=>{
        // Click handler for showing mealplan edit form
        setShowMeal(true);
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
                                      url:`${hostURL}/meal/${mealId}`,
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
                                            url:`${hostURL}/meal`,
                                            headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}
                                        })
            setResponse(resp.data);
        };
        fetchData();

    },[showForm, showMealList]);

    return(
        <div className="Meal">  
            {showMealList && <MealList response={response} viewForm={viewForm} editMeal={editMeal} deleteMeal={deleteMeal}/>}
            {showForm && <MealForm toggleForm={toggleForm} viewMealList={viewMealList}/>}
            {showMeal && <MealEdit viewMealList={viewMealList} mealId={viewingMealId} isLoading={isLoading} setIsLoading={setIsLoading}/>}
        </div>
    );
}

export default Meal;