import React from "react";
import QuantitySelector from "./QuantitySelector";
import { Table, Container, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import "./EntryLine.css";


const EntryLines = ({entries, deleteEntry, changeQty, setShowSearch, handleShowModal})=>{


    const handleClick = (meal)=>{
        handleShowModal();
        setShowSearch(()=>({show:true,
                            meal:meal}));
    }

    // const renderTooltip = (props) => {
    //     return <Tooltip id="button-tooltip" {...props}>
    //         {`Serving Unit:${props.msg}`}
    //     </Tooltip>
    // };

    return(
        <>
        <Container>
        <h4>Breakfast <Button className="bluebutton" size="sm" onClick={()=>handleClick("b")}><i class="fa-solid fa-plus"></i></Button></h4> 
        <Table striped bordered hover size="sm" responsive="xl" >
            <thead>
                <tr>
                <th className="w-10">Qty</th>
                <th  className="w-40">Food Name</th>
                <th className="w-10">Calories</th>
                <th className="w-10">Carbohydrates</th>
                <th className="w-10">Protein</th>
                <th className="w-10">Fat</th>    
                <th className="w-10">Actions</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry,idx)=>{
                    if(entry.meal === 'b' ){
                        return <tr className="DiaryView-entryline">
                                    <OverlayTrigger placement="right"
                                                    msg={entry.serving_size}
                                                    overlay={<Tooltip className="tooltip">
                                                                {`Serving Unit: ${entry.serving_size}`} 
                                                            </Tooltip>}>
                                        <td className="">
                                            <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                        </td>
                                    </OverlayTrigger>     

                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" className="redbutton" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>

            <br></br>

        </Table>
            <h4>Lunch <Button size="sm" className="bluebutton" onClick={()=>handleClick("l")}><i class="fa-solid fa-plus"></i></Button></h4>
        <Table striped bordered hover size="sm" responsive >
            <thead>
                <tr>
                    <th className="w-10">Qty</th>
                    <th  className="w-40">Food Name</th>
                    <th className="w-10">Calories</th>
                    <th className="w-10">Carbohydrates</th>
                    <th className="w-10">Protein</th>
                    <th className="w-10">Fat</th>    
                    <th className="w-10">Actions</th>
                </tr>
            </thead>
            <tbody>
            {entries.map((entry,idx)=>{
                    if(entry.meal === 'l' ){
                        return <tr className="DiaryView-entryline">
                                    <OverlayTrigger placement="right"
                                                    msg={entry.serving_size}
                                                    overlay={<Tooltip className="tooltip">
                                                                {`Serving Unit: ${entry.serving_size}`} 
                                                            </Tooltip>}>
                                        <td className="">
                                            <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                        </td>
                                    </OverlayTrigger>  
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" className="redbutton" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>
        </Table>
        <h4>Dinner <Button size="sm" className="bluebutton" onClick={()=>handleClick("d")}><i class="fa-solid fa-plus"></i></Button></h4>
        <Table striped bordered hover size="sm" responsive >
            <thead>
                <tr>
                    <th className="w-10">Qty</th>
                    <th className="w-40">Food Name</th>
                    <th className="w-10">Calories</th>
                    <th className="w-10">Carbohydrates</th>
                    <th className="w-10">Protein</th>
                    <th className="w-10">Fat</th>    
                    <th className="w-10">Actions</th>
                </tr>
            </thead>
            <tbody>
            {entries.map((entry,idx)=>{
                    if(entry.meal === 'd' ){
                        return <tr className="DiaryView-entryline">
                                    <OverlayTrigger placement="right"
                                                    msg={entry.serving_size}
                                                    overlay={<Tooltip className="tooltip">
                                                                {`Serving Unit: ${entry.serving_size}`} 
                                                            </Tooltip>}>
                                        <td className="">
                                            <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                        </td>
                                    </OverlayTrigger>  
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" className="redbutton" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
                                        </td>
                                </tr>
                }})}
            </tbody>
        </Table>
        <h4>Snacks <Button size="sm" className="bluebutton" onClick={()=>handleClick("s")}><i class="fa-solid fa-plus"></i></Button></h4>
        <Table striped bordered hover size="sm" responsive >
            <thead>
            <tr>
                    <th className="w-10">Qty</th>
                    <th  className="w-40">Food Name</th>
                    <th className="w-10">Calories</th>
                    <th className="w-10">Carbohydrates</th>
                    <th className="w-10">Protein</th>
                    <th className="w-10">Fat</th>    
                    <th className="w-10">Actions</th>
                </tr>
            </thead>
            <tbody>
            {entries.map((entry,idx)=>{
                    if(entry.meal === 's' ){
                        return <tr className="DiaryView-entryline">
                                    <OverlayTrigger placement="right"
                                                    msg={entry.serving_size}
                                                    overlay={<Tooltip className="tooltip">
                                                                {`Serving Unit: ${entry.serving_size}`} 
                                                            </Tooltip>}>
                                        <td className="">
                                            <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                        </td>
                                    </OverlayTrigger>  
                                    <td><img src={entry.image} className="DiaryView-image"></img> {entry.food_name}</td>
                                    <td>{entry.calorie*entry.quantity}</td>
                                    <td>{entry.carbs*entry.quantity}</td>
                                    <td>{entry.protein*entry.quantity}</td>
                                    <td>{entry.fat*entry.quantity}</td>
                                    <td>
                                        <Button variant="danger" size="sm" className="redbutton" onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></Button>
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