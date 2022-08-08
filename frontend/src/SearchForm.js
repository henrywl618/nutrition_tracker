import React, {useEffect, useState} from "react";
import SearchBar from "./SearchBar";
import {Modal, Button} from 'react-bootstrap';
import "./SearchForm.css"

const SearchForm = ({addEntry, setInput, input, results, setResults, meal, showModal, handleCloseModal, entryAdded, setEntryAdded})=>{

    //Get the top 5 commond foods and top 3 branded foods from results.
    const commonResults = results.common
        .slice(0,(results.common.length<=5 ? results.common.length : 5)) //Map only the first five items ot the whole array if its <= 5 items
        .map((result,idx)=>{
            if(idx<5){
                return <div className="SearchForm-result" onClick={()=>addEntry(results.common[idx], meal)}>{result.food_name}<img src={result.photo.thumb} className="SearchForm-image"/></div>
            }
    });

    const brandedResults = results.branded
        .slice(0, (results.branded.length<=3 ? results.branded.length : 3)) //Map only the first three items ot the whole array if its <= 3 items
        .map((result,idx)=>{
            if(idx<3){
                return <div className="SearchForm-result" onClick={()=>addEntry(results.branded[idx], meal)}>{result.food_name} <img src={result.photo.thumb} className="SearchForm-image"/></div>
            }
    });

    return(
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                {meal === 'b' ? <h3>Add a breakfast item</h3> : null}
                {meal === 'l' ? <h3>Add a lunch item</h3> : null}
                {meal === 'd' ? <h3>Add a dinner item</h3> : null}
                {meal === 's' ? <h3>Add a snack item</h3> : null}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {entryAdded && <p className="text-success">Item added</p>}
            <SearchBar setResults={setResults} setInput={setInput} input={input} entryAdded={entryAdded} setEntryAdded={setEntryAdded}/>
                 {results.common[0] || results.branded[0] ? ( <form>
                        <div className="SearchForm-resultwrapper" id="results">
                            <p>{`COMMON FOODS (${commonResults.length})`}</p>
                            {commonResults}
                            <p>{`BRANDED FOODS (${brandedResults.length})`}</p>
                            {brandedResults}
                        </div>
                    </form>)
                : null}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>    
    )
}

export default SearchForm;