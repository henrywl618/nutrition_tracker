import React, { useEffect, useState } from "react";
import {Modal, Button, ModalBody, ModalFooter} from "react-bootstrap";
import axios from "axios";
import "./MealPlanModal.css"
import { hostURL } from "./App";

const MealPlanModal = ({show, setShow, mealId, editMeal, deleteMeal})=>{
    let [entries, setEntries] = useState([]);
    let [nutrition, setNutrition] = useState({});
    let [title, setTitle] = useState("");
    let [image, setImage] = useState("");
    let [poster, setPoster] = useState("");
    let [canEdit, setCanEdit] = useState(false);
    let [tags, setTags] = useState([]);

    const handleEdit = ()=>{
        setShow(false);
        editMeal(mealId);
        
    };

    const handleDelete = ()=>{
        deleteMeal(mealId);
        setShow(false);
    };

    useEffect(()=>{
        const getMeal = async()=>{
            try{
                const resp = await axios.get(`${hostURL}/meal/${mealId}`, 
                                            {headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}})
                const meal = resp.data
                setTitle(meal.title)
                setImage(meal.header_image)
                setEntries(meal.entries)
                setNutrition(meal.nutrition_totals)
                setCanEdit(meal.can_edit)
                setPoster(meal.posted_by)
                setTags(meal.tags)
            }
            catch(error){
                console.log(error)
            }
        };
        getMeal();
    },[])

    return (
        <Modal className="Modal" show={show} onHide={()=>setShow(false)} centered>
            <Modal.Header className="p-0 Modal-header">
                <div className="Modal-headerwrapper">
                <Modal.Title className="Modal-title">{title}</Modal.Title>
                <img className="Modal-headerimg" src={image}></img>
                </div>
                <button type="button" className="btn-close Modal-close" aria-label="Close" onClick={()=>setShow(false)}></button>
            </Modal.Header>
            <Modal.Body className="Modal-body">
                <div className="Modal-tablewrap">
                <table className="table-borderless">
                    <thead>
                        <tr>
                            <th scope="col" className="px-1">Calories</th>
                            <th scope="col" className="px-1">Protein</th>
                            <th scope="col" className="px-1">Carbs</th>
                            <th scope="col" className="px-1">Total Fats</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="badge rounded-pill nutrition">{nutrition.calories}</span></td>
                            <td><span className="badge rounded-pill nutrition">{nutrition.protein} g</span></td>
                            <td><span className="badge rounded-pill nutrition">{nutrition.carbs} g</span></td>
                            <td><span className="badge rounded-pill nutrition">{nutrition.fat} g</span></td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <h5 className="mt-3">Breakfast</h5>
                <ul className="list-group">
                    {entries.map((entry)=>{
                        if(entry.meal === 'b'){
                            return <li className="Modal-item list-group-item">
                                        <span className="bold">
                                            <img className="Modal-listimg img-fluid rounded" src={entry.image}></img> {entry.food_name}
                                        </span>
                                        <span>
                                            <span className="bold px-0">{`Qty:`}</span><span>{`${entry.quantity} ${entry.serving_size}`}</span>
                                        </span>
                                    </li>
                        }
                    })}
                </ul>

                <h5>Lunch</h5>
                <ul className="list-group">
                    {entries.map((entry)=>{
                        if(entry.meal === 'l'){
                            return <li className="Modal-item list-group-item">
                                        <span className="bold">
                                            <img className="Modal-listimg img-fluid rounded" src={entry.image}></img> {entry.food_name}
                                        </span>
                                        <span>
                                            <span className="bold px-0">{`Qty:`}</span><span>{`${entry.quantity} ${entry.serving_size}`}</span>
                                        </span>
                                    </li>
                        }
                    })}
                </ul>
                
                <h5>Dinner</h5>
                <ul className="list-group">
                    {entries.map((entry)=>{
                        if(entry.meal === 'd'){
                            return  <li className="Modal-item list-group-item">
                                        <span className="bold">
                                            <img className="Modal-listimg img-fluid rounded" src={entry.image}></img> {entry.food_name}
                                        </span>
                                        <span>
                                            <span className="bold px-0">{`Qty:`}</span><span>{`${entry.quantity} ${entry.serving_size}`}</span>
                                        </span>
                                    </li>
                        }
                    })}
                </ul>
                
                <h5>Snacks</h5>
                <ul className="list-group">
                    {entries.map((entry)=>{
                        if(entry.meal === 's'){
                            return <li className="Modal-item list-group-item">
                                        <span className="bold">
                                            <img className="Modal-listimg img-fluid rounded" src={entry.image}></img> {entry.food_name}
                                        </span>
                                        <span>
                                            <span className="bold px-0">{`Qty:`}</span><span>{`${entry.quantity} ${entry.serving_size}`}</span>
                                        </span>
                                    </li>
                        }
                    })}
                </ul>
                
            </Modal.Body>
            <ModalFooter className="justify-content-between">
                <div className="col-6 text-start">
                    Posted by: {poster}
                </div>
                {
                canEdit &&
                <div className="col-5 d-flex justify-content-end">
                    <Button className="m-1 bluebutton" size="sm" onClick={handleEdit}>Edit</Button>
                    <Button className="m-1 redbutton" size="sm" variant="danger" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></Button>
                </div>
                }
            </ModalFooter>
        </Modal>
    )
}

export default MealPlanModal;