import React, {useState} from "react";

const useToggleBool = (boolean)=>{
    let [bool, setBool] = useState(boolean);

    const toggleBool = ()=>{
        setBool(!bool);
    }

    return [bool, toggleBool]
};
export {useToggleBool};