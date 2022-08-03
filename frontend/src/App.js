import React, {useState} from 'react';
import Diary from './Diary';
import AppNavbar from './AppNavbar';
import './App.css';


function App() {
  let [curentView,setCurrentView] = useState("");

  return (
    <div className="App">
      <AppNavbar />
      <Diary userId={4}/>
    </div>
  );
}

export default App;
