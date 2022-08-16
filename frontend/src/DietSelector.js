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
        <div>
            <label htmlFor="tags form-label">Dietary Restrictions?</label>
        </div>
        <div>
            <Select isMulti
                    onChange={handleChange}
                    name="tags"
                    defaultValue={inputValue ? inputValue : []}
                    className="basic-multi-select form-control-sm"
                    classNamePrefix="select"
                    options={options}/>
        </div>
        </>
    )
}

export default DietSelector;