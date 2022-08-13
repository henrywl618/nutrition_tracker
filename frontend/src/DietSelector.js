import React from "react";
import Select from 'react-select';

const options = [
    { value: 'vegan', label: 'vegan' },
    { value: 'gluten free', label: 'gluten free' },
    { value: 'vegetarian', label: 'vegetarian' },
    { value: 'keto', label: 'keto' },
  ]

const DietSelector = ({setTags,inputValue})=>{

    const handleChange = (e)=>{
        const tags = e.map((option)=>option.value)
        setTags(()=>tags)
    }

    return (
        <>
        <label htmlFor="tags">Dietary Restrictions?</label>
        <Select isMulti
                onChange={handleChange}
                name="tags"
                defaultValue={inputValue ? inputValue : []}
                className="basic-multi-select"
                classNamePrefix="select"
                options={options}/>
        </>
    )
}

export default DietSelector;