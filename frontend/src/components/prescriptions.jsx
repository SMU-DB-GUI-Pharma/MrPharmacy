import React, { Component } from "react";
import Prescription from "./prescription";

class Prescriptions extends Component {
  state = {
    prescriptions: [
      {
        id: 1,
        name: "Adderall",
        date: "05-05-2020",
        rx: "50mg",
        address: "430 Speed Street",
        age: 18,
      },
      {
        id: 2,
        name: "Xanax",
        date: "08-05-2020",
        rx: "50mg",
        address: "626 Chill Lane",
        age: 12,
      },
      {
        id: 3,
        name: "Nyquil",
        date: "06-09-2020",
        rx: "30mg",
        address: "123 Sleeper Street",
        age: 50,
      },
      {
        id: 4,
        name: "Morphine",
        date: "09-17-2020",
        rx: "50mg",
        address: "888 Aspen Road",
        age: 22,
      },
    ],
  };
  render() {
    return (
      <div className="m-2 p-2">
        {this.state.prescriptions.map((p) => (
          <p className="border border-dark bg-light">
            <Prescription
              key={p.id}
              name={p.name}
              date={p.date}
              rx={p.rx}
              address={p.address}
              age={p.age}
            ></Prescription>
          </p>
        ))}
      </div>
    );
  }
}

export default Prescriptions;
