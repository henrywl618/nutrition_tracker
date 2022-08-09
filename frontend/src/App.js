import React, {useEffect, useState} from 'react';
import Diary from './Diary';
import AppNavbar from './AppNavbar';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './App.css';
import Meal from './Meal';


function App() {
  let [currentView,setCurrentView] = useState("diary");
  let [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(()=>{
    if(localStorage.getItem('accessToken')){
      setLoggedIn(true)
    }
  });

  return (
    <div className="App">
      <AppNavbar setLoggedIn={setLoggedIn} loggedIn={loggedIn} setCurrentView={setCurrentView}/>
      {loggedIn && currentView === 'diary' && <Diary />}
      {loggedIn && currentView === 'mealplan' && <Meal />}
      {!loggedIn && currentView === 'signup' &&   <SignupForm setLoggedIn={setLoggedIn} setCurrentView={setCurrentView}/>}
      {!loggedIn && currentView === 'login' &&   <LoginForm setLoggedIn={setLoggedIn} setCurrentView={setCurrentView}/>}
    </div>
  );
}

export default App;
