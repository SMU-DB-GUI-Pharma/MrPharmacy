import React from "react";
import { NavBar, PrescriptionList } from "./index.js";
import { PrescriptionRepository } from "../api/index.js";

export class DashBoard extends React.Component {
  prescriptionRepository = new PrescriptionRepository();

  state = {
    username: "",
    currentPrescriptions: [],
    pastPrescriptions: [],
  };

  onSorting(prescirotionId, sortingId) {
    if (prescirotionId === 0) {
      this.prescriptionRepository
        .getCurrentPrescription(sortingId)
        .then((prescriptions) =>
          this.setState({ currentPrescriptions: prescriptions })
        );
    } else {
      this.prescriptionRepository
        .getPastPrescription(sortingId)
        .then((prescriptions) =>
          this.setState({ currentPrescriptions: prescriptions })
        );
    }
  }

  getHeaders(heading, id) {
    return (
      <>
        <ul
          className="list-group list-group-horizontal"
          style={{ listStyleType: "none" }}
        >
          <li>
            <h2>{heading}</h2>
          </li>
          <li>
            <button
              className="btn btn-primary ml-5"
              onClick={(e) => this.onSorting(id, 0)}
            >
              Recurring Only
            </button>
          </li>
          <li>
            <button
              className="btn btn-primary ml-5"
              onClick={(e) => this.onSorting(id, 1)}
            >
              Non-Recurring
            </button>
          </li>
          <li>
            <button
              className="btn btn-primary ml-5"
              onClick={(e) => this.onSorting(id, 2)}
            >
              Most Recent
            </button>
          </li>
          <li>
            <button
              className="btn btn-primary ml-5"
              onClick={(e) => this.onSorting(id, 3)}
            >
              Least Recent
            </button>
          </li>
        </ul>
        <div className="line-break"></div>
      </>
    );
  }

  render() {
    return (
      <>
        <NavBar
          state={"dashboard"}
          obj={this}
          username={this.state.username}
        ></NavBar>
        <div className="standard-margin">
          {this.getHeaders("Current Prescription")}
          <PrescriptionList
            prescriptions={this.state.currentPrescriptions}
            username={this.state.username}
          />
          <br />
          {this.getHeaders("Past Prescription")}
          <PrescriptionList
            prescriptions={this.state.pastPrescriptions}
            username={this.state.username}
          />
        </div>
      </>
    );
  }

  componentDidMount() {
    let name = this.props.match.params.username;
    this.prescriptionRepository
      .getPrescriptions(name, 0, false)
      .then((prescriptions) =>
        this.setState({ currentPrescriptions: prescriptions })
      );
    this.prescriptionRepository
      .getPrescriptions(name, 0, true)
      .then((prescriptions) =>
        this.setState({ pastPrescriptions: prescriptions })
      );
    this.setState({ username: name });
  }
}
