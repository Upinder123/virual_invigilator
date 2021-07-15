import React from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => (
  <Navbar bg="dark" variant="dark" expand="md">
    <NavLink to="/admin" className="navbar-brand">
      Admin
    </NavLink>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <NavLink
          exact
          className="nav-link"
          to="/admin/dashboard"
          activeClassName="active"
        >
          Dashboard
        </NavLink>

        <NavLink
          exact
          className="nav-link"
          to="/admin/user"
          activeClassName="active"
        >
          Users
        </NavLink>

        <NavLink
          exact
          className="nav-link"
          to="/admin/batch"
          activeClassName="active"
        >
          Batches
        </NavLink>
        <NavLink
          exact
          className="nav-link"
          to="/admin/subject"
          activeClassName="active"
        >
          Subjects
        </NavLink>
        <NavLink
          exact
          className="nav-link"
          to="/admin/exam"
          activeClassName="active"
        >
          Exams
        </NavLink>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default AdminNavbar;
