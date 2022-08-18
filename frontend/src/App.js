import React, {useEffect, useState} from 'react';
import Diary from './Diary';
import AppNavbar from './AppNavbar';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './App.css';
import Meal from './Meal';
import UserPage from './UserPage';
import Homepage from './Homepage';
const hostURL = 'https://nutrition-tracker00.herokuapp.com'


function App() {
  let [currentView,setCurrentView] = useState({view:"homepage"});
  let [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(()=>{
    if(localStorage.getItem('accessToken')){
      setLoggedIn(true)
    }
  },[]);

  return (
    <div className="App">
      <AppNavbar setLoggedIn={setLoggedIn} loggedIn={loggedIn} view={currentView.view} setCurrentView={setCurrentView}/>
      {loggedIn && currentView.view === 'diary' && <Diary />}
      {loggedIn && currentView.view === 'mealplan' && <Meal />}
      {loggedIn && currentView.view === 'user' && <UserPage />}
      {currentView.view === 'homepage' && <Homepage />}
      {!loggedIn && currentView.view === 'signup' &&   <SignupForm setLoggedIn={setLoggedIn} setCurrentView={setCurrentView}/>}
      {!loggedIn && currentView.view === 'login' &&   <LoginForm setLoggedIn={setLoggedIn} setCurrentView={setCurrentView}/>}
    </div>
  );
}

export default App;
export {hostURL};
