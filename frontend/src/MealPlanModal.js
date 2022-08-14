import React, { useEffect, useState } from "react";
import {Modal, Button, ModalBody} from "react-bootstrap";
import axios from "axios";
import "./MealPlanModal.css"

const MealPlanModal = ({show, setShow, mealId})=>{
    let [entries, setEntries] = useState([])
    let [title, setTitle] = useState("");
    let [image, setImage] = useState("");
    let [tags, setTags] = useState([]);

    useEffect(()=>{
        const getMeal = async()=>{
            try{
                const resp = await axios.get(`http://127.0.0.1:5000/meal/${mealId}`, 
                                            {headers:{Authorization: `Bearer ${localStorage.getItem('accessToken')}`}})
                const meal = resp.data
                setTitle(meal.title)
                setImage(meal.header_image)
                setEntries(meal.entries)
                setTags(meal.tags)
            }
            catch(error){
                console.log(error)
            }
        };
        getMeal();
    },[])

    return (
        <Modal show={show} onHide={()=>setShow(false)} centered>
            <Modal.Header className="p-0 Modal-header">
                <div className="Modal-headerwrapper">
                <Modal.Title className="Modal-title">{title}</Modal.Title>
                <img className="Modal-headerimg" src={image}></img>
                </div>
                <button type="button" className="btn-close Modal-close" aria-label="Close" onClick={()=>setShow(false)}></button>
            </Modal.Header>
            <Modal.Body>
                <h5>Breakfast</h5>
                <ul>
                    {entries.map((entry)=>{
                        if(entry.meal === 'b'){
                            return <li className="Modal-item"><img className="Modal-listimg" src={entry.image}></img> {entry.food_name}</li>
                        }
                    })}
                </ul>

                <h5>Lunch</h5>
                <ul>
                    {entries.map((entry)=>{
                        if(entry.meal === 'l'){
                            return <li className="Modal-item"><img className="Modal-listimg" src={entry.image}></img> {entry.food_name}</li>
                        }
                    })}
                </ul>
                
                <h5>Dinner</h5>
                <ul>
                    {entries.map((entry)=>{
                        if(entry.meal === 'd'){
                            return <li className="Modal-item"><img className="Modal-listimg" src={entry.image}></img> {entry.food_name}</li>
                        }
                    })}
                </ul>
                
                <h5>Snacks</h5>
                <ul>
                    {entries.map((entry)=>{
                        if(entry.meal === 's'){
                            return <li className="Modal-item"><img className="Modal-listimg" src={entry.image}></img> {entry.food_name}</li>
                        }
                    })}
                </ul>
                
            </Modal.Body>
        </Modal>
    )
}

export default MealPlanModal;