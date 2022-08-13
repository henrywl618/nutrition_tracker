import React from "react";
import QuantitySelector from "./QuantitySelector";
import { Table, Container, Button } from "react-bootstrap";


const EntryLines = ({entries, deleteEntry, changeQty, setShowSearch, handleShowModal})=>{

    const handleClick = (meal)=>{
        handleShowModal();
        setShowSearch(()=>({show:true,
                            meal:meal}));
    }

    return(
        <>
        <Container>
        <h4>Breakfast <Button size="sm" onClick={()=>handleClick("b")}><i class="fa-solid fa-plus"></i></Button></h4> 
        <Table striped bordered hover size="sm" responsive >
            <thead>
                <tr>
                <th>Qty</th>
                <th>Food Name</th>
                <th>Calories</th>
                <th>Carbohydrates</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry,idx)=>{
                    if(entry.meal === 'b' ){
                        return <tr className="DiaryView-entryline">
                                    <td><QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/></td>
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>

            <br></br>

        </Table>
            <h4>Lunch <Button size="sm" onClick={()=>handleClick("l")}><i class="fa-solid fa-plus"></i></Button></h4>
        <Table striped bordered hover size="sm" responsive >
            <thead>
                <tr>
                <th>Qty</th>
                <th>Food Name</th>
                <th>Calories</th>
                <th>Carbohydrates</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {entries.map((entry,idx)=>{
                    if(entry.meal === 'l' ){
                        return <tr className="DiaryView-entryline">
                                    <td><QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/></td>
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>
        </Table>
        <h4>Dinner <Button size="sm" onClick={()=>handleClick("d")}><i class="fa-solid fa-plus"></i></Button></h4>
        <Table striped bordered hover size="sm" responsive >
            <thead>
                <tr>
                <th>Qty</th>
                <th>Food Name</th>
                <th>Calories</th>
                <th>Carbohydrates</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {entries.map((entry,idx)=>{
                    if(entry.meal === 'd' ){
                        return <tr className="DiaryView-entryline">
                                    <td><QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/></td>
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>
        </Table>
        <h4>Snacks <Button size="sm" onClick={()=>handleClick("s")}><i class="fa-solid fa-plus"></i></Button></h4>
        <Table striped bordered hover size="sm" responsive >
            <thead>
                <tr>
                <th>Qty</th>
                <th>Food Name</th>
                <th>Calories</th>
                <th>Carbohydrates</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {entries.map((entry,idx)=>{
                    if(entry.meal === 's' ){
                        return <tr className="DiaryView-entryline">
                                    <td><QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/></td>
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>
        </Table>
        </Container>
        </>
    )
}

export default EntryLines;