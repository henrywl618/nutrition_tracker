import React, {useState} from "react";
import { Card, Button, Badge, Container, CardGroup } from "react-bootstrap";
import "./MealList.css";
import MealPlanModal from "./MealPlanModal";

const MealList = ({response, viewForm, editMeal, deleteMeal})=>{
    const [show, setShow] = useState(false);
    const [viewId, setViewId] = useState(null);

    const handleClick = (id)=>{
        setViewId(id)
        setShow(true)
    }

    return(
        <>
            <h4>Meal Plans</h4>
            <button onClick={viewForm}>Create a new meal</button>
        <Container>
            <div className="card-deck row justify-content-center">
                {response && response.map((meal)=>{
                    return <div className="card col-xl-3 col-md-4 col-8 m-3 p-0 MealList-card" onClick={()=>handleClick(meal.id)}>
                            <div class="card-img-top MealList-cardimagecontainer">
                            <img class="card-img-top MealList-cardimage" src={meal.header_image} alt="Card image cap"/>
                            <div class="MealList-tags">{meal.tags.map((tag)=><Badge pill className="my-1 ms-1 Mealist-badge">{tag}</Badge>)}</div>
                            </div>
                            
                            <div class="card-body MealList-cardbody">
                            <h5 class="card-title">{meal.title}</h5>
                            </div>
                    </div>
                })}
            </div>

            {viewId && show && <MealPlanModal show={show} setShow={setShow} mealId={viewId} editMeal={editMeal} deleteMeal={deleteMeal}/>}

        </Container>

        </>

    )
};

export default MealList;