import React, { useState } from "react";
import { Carousel, Container } from "react-bootstrap";
import img1 from "./img/homepage1.png";
import img2 from "./img/homepage2.png";
import img3 from "./img/homepage3.png";
import img4 from "./img/homepage4.png";
import img5 from "./img/homepage5.png";
import "./Homepage.css";

const Homepage = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <>
    <h1>
        Nutrition Tracking Made Easy
    </h1>
      <Container className="d-flex justify-content-center">
        <Carousel className="col-md-8" variant="dark" activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item>
            <img className="d-block w-100 Carousel-img" src={img1} alt="First slide" />
            <Carousel.Caption className="Carousel-caption">
              <h3>Find any food</h3>
              <p>Search for food items from a database of 900k+ items!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 Carousel-img" src={img2} alt="Second slide" />

            <Carousel.Caption className="Carousel-caption">
              <h3>Track your daily intake</h3>
              <p>Keep track of your total daily calorie, protein, carb and fat intake!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 Carousel-img" src={img3} alt="Third slide" />

            <Carousel.Caption className="Carousel-caption">
              <h3>Add as you go!</h3>
              <p>
                Add/edit your diary as you eat throughout the day!
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 Carousel-img" src={img4} alt="Fourth slide" />

            <Carousel.Caption className="Carousel-caption">
              <h3>Mealplans</h3>
              <p>
                Create a mealplan to help you plan your day or week.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 Carousel-img" src={img5} alt="Fifth slide" />

            <Carousel.Caption className="Carousel-caption">
              <h3>Mealplans</h3>
              <p>
                Or follow a mealplan made by others!
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
    </>
  );
};

export default Homepage;
