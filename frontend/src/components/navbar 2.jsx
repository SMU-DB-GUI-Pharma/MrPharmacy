import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-primary">
        <a
          style={{ fontSize: 40, color: "White" }}
          className="navbar-brand"
          href="#"
        >
          Pharma
        </a>
      </nav>
    );
  }
}

export default NavBar;
