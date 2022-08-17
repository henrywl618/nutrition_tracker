import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./AppNavBar.css"


const AppNavbar = ({setLoggedIn, loggedIn, view, setCurrentView})=>{

  const logout = ()=>{
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
    setCurrentView({view:'homepage'})
  };

  return (
    <Navbar className="AppNavBar mb-3" expand='lg'>
      <Container>
      <Navbar.Brand className="Navbar-brand"
                    href="#"
                    onClick={()=>setCurrentView({view:'homepage'})}>
        <i className="fa-solid fa-wheat-awn mx-2"></i>
        Nutrition Tracker
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="">
          <Nav variant="tabs" className="me-auto ">
            {loggedIn &&
            <>
            <Nav.Link disabled={view === "diary"}
                      className="nav-link"
                      onClick={()=>setCurrentView({view:'diary'})}>
                      <i className="fa-solid fa-book mx-1"></i>
                      Daily Food Diaries
            </Nav.Link>
            <Nav.Link disabled={view === "mealplan"}
                      className="nav-link"
                      onClick={()=>setCurrentView({view:'mealplan'})}> 
                      <i className="fa-solid fa-utensils mx-1"></i>
                      Mealplans
            </Nav.Link>
            </>
            }
          </Nav>
          <Nav className="justify-content-end">
            {!loggedIn &&
            <>
            <Nav.Link onClick={()=>setCurrentView({view:'signup'})}><i className="fa-solid fa-user-plus mx-1"></i> Signup</Nav.Link>
            <Nav.Link onClick={()=>setCurrentView({view:'login'})}><i className="fa-solid fa-right-to-bracket mx-1"></i>Login</Nav.Link>
            </>}
            {loggedIn && 
            <>
            <Nav.Link onClick={()=>setCurrentView({view:'user'})}><i className="fa-solid fa-user mx-1"></i> {localStorage.getItem('user')}</Nav.Link>
            <Nav.Link onClick={logout}><i className="fa-solid fa-right-from-bracket mx-1"></i> Logout</Nav.Link>
            </>}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default AppNavbar;
