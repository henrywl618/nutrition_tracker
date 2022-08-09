import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const AppNavbar = ({setLoggedIn, loggedIn, setCurrentView})=>{

  const logout = ()=>{
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
  };

  return (
    <Navbar expand='lg'>
      <Container>
      <Navbar.Brand href="#home">Nutrition Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Nav className="me-auto ">
            {loggedIn &&
            <>
            <Nav.Link onClick={()=>setCurrentView('diary')}>Daily Food Diaries</Nav.Link>
            <Nav.Link onClick={()=>setCurrentView('mealplan')}>Mealplans</Nav.Link>
            </>
            }
          </Nav>
          <Nav className="justify-content-end">
            {!loggedIn &&
            <>
            <Nav.Link onClick={()=>setCurrentView('signup')}>Signup</Nav.Link>
            <Nav.Link onClick={()=>setCurrentView('login')}>Login</Nav.Link>
            </>}
            {loggedIn && <Nav.Link onClick={logout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default AppNavbar;
