import React from "react";
import {
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

const AppNavbar = ({setLoggedIn, loggedIn, setCurrentView}) => {

  const logout = ()=>{
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
  };

  return (
    <Nav tabs>
      <NavItem>
        <NavLink active href="#">
          Food Diary
        </NavLink>
      </NavItem>
      {!loggedIn && <>
        <NavItem>
          <NavLink onClick={()=>setCurrentView('signup')}>Signup</NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={()=>setCurrentView('login')}>Login</NavLink>
        </NavItem>
      </>}
      {
        loggedIn &&
        <>
        <NavItem>
          <NavLink onClick={()=>setCurrentView('diary')}>Daily Food Diaries</NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={()=>setCurrentView('mealplan')}>Meal Plans</NavLink>
        </NavItem>
        <NavItem>
          <NavLink disabled href="#">
            User Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={logout}>
            Logout
          </NavLink>
        </NavItem>        
        </>
      }

    </Nav>
  );
};

export default AppNavbar;
