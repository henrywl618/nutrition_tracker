import React from "react";

const QuantitySelector = ({changeQty, qty, index})=>{

    return (
        <span>
            <button onClick={()=>changeQty('dec',index)}>-</button>
            {qty}
            <button onClick={()=>changeQty('inc',index)}>+</button>
        </span>
    )
};

export default QuantitySelector;