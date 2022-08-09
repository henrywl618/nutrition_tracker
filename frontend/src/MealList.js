import React from "react";

const MealList = ({response, viewForm, viewMeal, deleteMeal})=>{

    return(
        <ul className="Meal-list">
            <h4>Meal Plans</h4>
            <button onClick={viewForm}>Create a new meal</button>
            {response && response.map((meal)=>{
                return <li>
                        <a onClick={()=>viewMeal(true,meal.id)}>{meal.title}</a>
                        <button onClick={()=>deleteMeal(meal.id)}><i className="fa-solid fa-trash-can"></i></button>
                    </li>
            })}
        </ul>
    )
};

export default MealList;