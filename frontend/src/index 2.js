import ReactDOM from "react-dom";
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Prescriptions from "./components/prescriptions";
import NavBar from "./components/navbar";

const Welcome = () => {
  console.log("display welcome message");
  return (
    <>
      <h1>Welcome to Pharma</h1>
    </>
  );
};

const App = () => {
  return (
    <React.Fragment>
      <NavBar />
      <main className="container">
        <h1 className="m-3 text-primary">Prescriptions</h1>
        <hr />
        <Prescriptions />
      </main>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
