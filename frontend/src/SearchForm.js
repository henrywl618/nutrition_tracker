import React, {useState} from "react";
import SearchBar from "./SearchBar";
import "./SearchForm.css"

const SearchForm = ({addEntry, setInput, input, results, setResults})=>{

    //Get the top 5 commond foods and top 3 branded foods from results.
    const commonResults = results.common
        .slice(0,(results.common.length<=5 ? results.common.length : 5)) //Map only the first five items ot the whole array if its <= 5 items
        .map((result,idx)=>{
            if(idx<5){
                return <div className="SearchForm-result" onClick={()=>addEntry(results.common[idx])}>{result.food_name}<img src={result.photo.thumb} className="SearchForm-image"/></div>
            }
    });

    const brandedResults = results.branded
        .slice(0, (results.branded.length<=3 ? results.branded.length : 3)) //Map only the first three items ot the whole array if its <= 3 items
        .map((result,idx)=>{
            if(idx<3){
                return <div className="SearchForm-result" onClick={()=>addEntry(results.branded[idx])}>{result.food_name} <img src={result.photo.thumb} className="SearchForm-image"/></div>
            }
    });

    return(
        <div className="SearchForm">
        <SearchBar setResults={setResults} setInput={setInput} input={input}/>
        {results.common[0] || results.branded[0] ? ( <form>
                        <div className="SearchForm-resultwrapper" id="results">
                            <p>{`COMMON FOODS (${commonResults.length})`}</p>
                            {commonResults}
                            <p>{`BRANDED FOODS (${brandedResults.length})`}</p>
                            {brandedResults}
                        </div>
                    </form>)
                : null}
        </div>
    )
}

export default SearchForm;