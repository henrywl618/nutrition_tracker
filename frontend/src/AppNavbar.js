import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./AppNavBar.css"


const AppNavbar = ({setLoggedIn, loggedIn, setCurrentView})=>{

  const logout = ()=>{
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
  };

  return (
    <Navbar className="AppNavBar mb-3" expand='lg'>
      <Container>
      <Navbar.Brand href="#home" className="Navbar-brand"><i className="fa-solid fa-utensils mx-2"></i>Nutrition Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Nav className="me-auto ">
            {loggedIn &&
            <>
            <Nav.Link onClick={()=>setCurrentView({view:'diary'})}>Daily Food Diaries</Nav.Link>
            <Nav.Link onClick={()=>setCurrentView({view:'mealplan'})}>Mealplans</Nav.Link>
            </>
            }
          </Nav>
          <Nav className="justify-content-end">
            {!loggedIn &&
            <>
            <Nav.Link onClick={()=>setCurrentView({view:'signup'})}>Signup</Nav.Link>
            <Nav.Link onClick={()=>setCurrentView({view:'login'})}>Login</Nav.Link>
            </>}
            {loggedIn && 
            <>
            <Nav.Link onClick={()=>setCurrentView({view:'user'})}>{localStorage.getItem('user')}</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default AppNavbar;
