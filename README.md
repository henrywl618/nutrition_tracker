# **[Nutrition Tracker][App-Link]**

## **Overview**

Nutrition Tracker was created to allow users to easily log their daily food intake to keep track of how many calories, protein, carbohydrates and fats they are intaking. Users can search from over 900k+ food items to add to their daily food diary. 

Users can also create mealplans to easily plan out their day/week. Users can also view and follow a mealplan created by others!

## **Features**
- Search for over 900,000+ food items
- Track your total daily calorie, protein, carbohydrate and fat intake
- Create a diary and add as you eat through ou the day
- Create a own mealplan to easily plan out your day/week
- View mealplans created by others
- Edit/Delete any diary or mealplan you created

## **Built with**
* Frontend  
  
  [![React][React.js]][React-url] [![JavaScript]][Javascript-url] [![Bootstrap][Bootstrap.com]][Bootstrap-url] ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* Backend  
  
  ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
  ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
  ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
  ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-red?style=for-the-badge)

* Misc. 
  
  ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
  ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
  ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
  



## **Installation**

- Clone repository using command line
  
    ```terminal
    $git clone https://github.com/henrywl618/nutrition_tracker.git
    ```

- Create virtual environment and activate it

    ```terminal
    $python3 -m venv venv
    $source venv/bin/activate
    ```

- Install all requirements

    ```terminal
    $pip install -r requirements.txt
    ```
- Set up the frontend
    1. Install NPM packages
        ```terminal
            $cd frontend
            $npm install
        ```
    2. Update local host URL in `/frontend/src/App.js`
        ```js
        const hostURL = '127.0.0.1:5000'
        ```
    3. Update build
        ```
        $npm run build
        ```
- Start the app in localhost

    ```terminal
    $flask run
    ```
## **API Used**

[NutritionIX API](https://developer.nutritionix.com/docs/v2)

## **Database Schema**

![database_schema](./static/database_schema.png)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[App-Link]: https://nutrition-tracker00.herokuapp.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JavaScript]:https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]:https://developer.mozilla.org/en-US/docs/Web/JavaScript

