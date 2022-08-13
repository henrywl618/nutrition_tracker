import React from "react";
import { Button } from "react-bootstrap";
import "./QuantitySelector.css"

const QuantitySelector = ({changeQty, qty, index})=>{

    return (
        <>
            <Button size="sm" className="QS-button px-1 py-0" onClick={()=>changeQty('dec',index)}><i class="fa-solid fa-minus"></i></Button>
            <span>{qty}</span>
            <Button size="sm" className="QS-button px-1 py-0" onClick={()=>changeQty('inc',index)}><i class="fa-solid fa-plus"></i></Button>
        </>
    )
};

export default QuantitySelector;