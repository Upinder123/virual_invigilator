import React from 'react';
import {
  Nav,
  NavLink,
  // Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
import './Navbar.css';

function Navbar() {
  return (
    <>
      <Nav className="client-nav">
        <NavLink to="/">
          <div className="brand">
            <img src="https://p.jing.fm/clipimg/small/310-3104647_clip-art-trivia-icon.png" alt="logo" />
          </div>
        </NavLink>
        {/* <Bars /> */}
        <NavMenu>
          <NavLink to="/about">
            About
          </NavLink>
          <NavLink to="/services">
            Services
          </NavLink>
          <NavLink to="/contact-us">
            Contact Us
          </NavLink>
          <NavLink to="/progress">
            Progress
          </NavLink>
          <NavLink to="/sign-up">
            Sign Up
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to="/sign-in">Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/sign-in">Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
}

export default Navbar;
