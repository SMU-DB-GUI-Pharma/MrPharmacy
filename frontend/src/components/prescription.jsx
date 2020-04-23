import React, { Component } from "react";

class Prescription extends Component {
  state = {
    name: this.props.name,
    date: this.props.date,
    Rx: this.props.rx,
    Address: this.props.address,
    Age: this.props.age,
  };

  styles = {
    fontSize: 12,
  };

  render() {
    return (
      <div>
        <p className="m-2">
          Name: {this.state.name} <br />
          Date: {this.state.date} <br />
          Rx: {this.state.Rx} <br />
          Address: {this.state.Address} <br />
          Age: {this.state.Age}
        </p>
      </div>
    );
  }
}

export default Prescription;
