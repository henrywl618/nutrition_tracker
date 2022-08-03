import React from "react";
import {
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

const AppNavbar = () => {

  return (
    <Nav tabs>
      <NavItem>
        <NavLink active href="#">
          Food Diary
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Meal Plan</NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled href="#">
          User Profile
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default AppNavbar;
