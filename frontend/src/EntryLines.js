import React from "react";
import QuantitySelector from "./QuantitySelector";

const EntryLines = ({entries, deleteEntry, changeQty, setShowSearch, handleShowModal})=>{

    const handleClick = (meal)=>{
        handleShowModal();
        setShowSearch(()=>({show:true,
                            meal:meal}));
    }

    return(
        <ul>
            <h3>Breakfast <button onClick={()=>handleClick("b")}><i class="fa-solid fa-plus"></i></button></h3>
            {entries.map((entry,idx)=>{
                if(entry.meal === 'b' ){
                    return <li className="DiaryView-entryline">
                                {entry.food_name}  |  Calories:{entry.calorie*entry.quantity} 
                                <img src={entry.image} className="DiaryView-image"></img> 
                                <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                <button onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></button>
                            </li>
                }
            })}
            <h3>Lunch <button onClick={()=>handleClick("l")}><i class="fa-solid fa-plus"></i></button></h3>
            {entries.map((entry, idx)=>{
                if(entry.meal === 'l' ){
                    return <li className="DiaryView-entryline">
                                {entry.food_name}  | Calories:{entry.calorie*entry.quantity} 
                                <img src={entry.image} className="DiaryView-image"></img> 
                                <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                <button onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></button>
                            </li>
                }
            })}
            <h3>Dinner <button onClick={()=>handleClick("d")}><i class="fa-solid fa-plus"></i></button></h3>
            {entries.map((entry, idx)=>{
                if(entry.meal === 'd' ){
                    return <li className="DiaryView-entryline">
                                {entry.food_name}  | Calories:{entry.calorie*entry.quantity} 
                                <img src={entry.image} className="DiaryView-image"></img> 
                                <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                <button onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></button>
                            </li>
                }
            })}
            <h3>Snacks <button onClick={()=>handleClick("s")}><i class="fa-solid fa-plus"></i></button></h3>
            {entries.map((entry, idx)=>{
                if(entry.meal === 's' ){
                    return <li className="DiaryView-entryline">
                                {entry.food_name}  |  Calories:{entry.calorie*entry.quantity} 
                                <img src={entry.image} className="DiaryView-image"></img> 
                                <QuantitySelector changeQty={changeQty} index={idx} qty={entry.quantity}/>
                                <button onClick={()=>deleteEntry(idx)}><i className="fa-solid fa-trash-can"></i></button>
                            </li>
                }
            })}
        </ul>
    )
}

export default EntryLines;