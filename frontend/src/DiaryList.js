import React from "react";
import { Button, Card, Container, Row } from "react-bootstrap";
import "./DiaryList.css";

const DiaryList = ({response, viewForm, viewDiary, deleteDiary})=>{

    return(
        <>

        <h4>Daily Food Diaries</h4>
        <Button onClick={viewForm}>Create a new diary</Button>
        <br></br>
        <h5 className="mt-5">Previous Entries</h5>
        <Container>
            <div className="row justify-content-center">
            {response && response.map((diary)=>{
                return <Card className="col-xl-3 col-md-4 col-8 m-3 p-0">
                        <Card.Header className="DiaryList-cardheader">
                            {diary.date}
                        </Card.Header>
                        <Card.Body>
                            <div className="DiaryList-nutrition"><span className="DiaryList-nutritionlabel">Calories</span><span className="DiaryList-nutritiontotal">{diary.nutrition_totals.calories}</span></div>
                            <div className="DiaryList-nutrition"><span className="DiaryList-nutritionlabel">Protein</span><span className="DiaryList-nutritiontotal">{diary.nutrition_totals.protein}</span></div>
                            <div className="DiaryList-nutrition"><span className="DiaryList-nutritionlabel">Carbohydrates</span><span className="DiaryList-nutritiontotal">{diary.nutrition_totals.carbs}</span></div>
                            <div className="DiaryList-nutrition"><span className="DiaryList-nutritionlabel">Fat</span><span className="DiaryList-nutritiontotal">{diary.nutrition_totals.fat}</span></div>
                        </Card.Body>
                        <Card.Footer>
                            <Button className="m-1" size="sm" onClick={()=>viewDiary(true,diary.id)}>View / Edit</Button>
                            <Button className="m-1" size="sm" onClick={()=>deleteDiary(diary.id)}>Delete <i className="fa-solid fa-trash-can"></i></Button>
                        </Card.Footer>
                       </Card>
                })}
            </div>

                        
        </Container>

        </>
    )
};

export default DiaryList;
