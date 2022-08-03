import React, {useState} from "react";
import SearchBar from "./SearchBar";
import "./SearchForm.css"

const SearchForm = ()=>{
    let [results, setResults] = useState({common:[],branded:[]});

    const commonResults = results.common.map((result,idx)=>{
        if(idx<5){
            return <div className="SearchForm-result">{result.food_name}<img src={result.photo.thumb} className="SearchForm-image"/></div>
        }
    });

    const brandedResults = results.branded.map((result,idx)=>{
        if(idx<3){
            return <option className="SearchForm-result">{result.food_name}<img src={result.photo.thumb} className="SearchForm-image"/></option>
        }
    });
    return(
        <div className="SearchForm">
        <SearchBar setResults={setResults}/>
        <form>
            <div className="SearchForm-resultwrapper" id="results">
                <h5>Common</h5>
                {commonResults}
                <h5>Branded</h5>
                {brandedResults}
            </div>
        </form>
        </div>
    )
}

export default SearchForm;