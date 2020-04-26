import React from 'react';
import { NavBar } from './index.js';
import { PrescriptionRepository } from '../api/index.js';
import { Redirect } from 'react-router-dom'
import { Prescription } from '../modules'

export class PrescriptionDetail extends React.Component {

    prescriptionRepository = new PrescriptionRepository();

    state = {
        username: '',
        prescription: {}
    }

    onSave() {
        // FIXME: incomplete prescription base on current input

    }

    onCreate() {
        // FIXME: incomplete prescription base on current input
        this.prescriptionRepository.createPrescription(this.state.username, this.state.prescription);
        this.setState({ redirect: "/" + this.state.username + "/dashboard" })
    }

    changeHandler = event => {
        event.persist();
        this.setState(prevState => ({
            prescription: { ...prevState.prescription, [event.target.name]: event.target.value }
        }))
    };

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        if (this.props.match.path.endsWith("/prescription-creation")) {
            return <>
                <NavBar />
                <div className="close-margin">
                    <h2>{this.state.prescription.name}</h2>
                    <div className="line-break"></div>
                    <form name="prescription" className="mt-3">
                        <div className="form-group">
                            <label htmlFor="name">Prescription name:</label>
                            <input type="text" className="form-control" id="name" name="name" onChange={this.changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="medication">Prescription Medication:</label>
                            <input type="text" className="form-control" id="medication" name="medication" onChange={this.changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="createdDate">Prescription created Date:</label>
                            <input type="date" className="form-control" id="createdDate" name="createdDate" value={this.state.prescription.createdDate} onChange={this.changeHandler} />
                        </div>
                    </form>
                    <div className="text-right mt-4">
                        <button type="button" className="btn btn-lg btn-primary ml-5" onClick={e => this.onCreate()}>Create Prescription</button>
                    </div>
                </div>
            </>
        } else if (!this.state.prescription) {
            return <>Loading... </>
        }

        return <>
            <NavBar />
            <div className="close-margin">
                <h2>{this.state.prescription.name}</h2>
                <div className="line-break"></div>
                <form name="prescription" className="mt-3">
                    <div className="form-group">
                        <label htmlFor="name">Prescription name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={this.state.prescription.name} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="medication">Prescription Medication:</label>
                        <input type="text" className="form-control" id="medication" name="medication" value={this.state.prescription.medication} onChange={this.changeHandler} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="createdDate">Prescription created Date:</label>
                        <input type="date" className="form-control" id="createdDate" name="createdDate" value={this.state.prescription.createdDate} onChange={this.changeHandler} />
                    </div>
                </form>
                <div className="text-right mt-4">
                    <button type="button" className="btn btn-lg btn-primary ml-5" onClick={() => console.log("FIXME: route to pick pharmacy page")}>Pick Pharmacy</button>
                </div>
            </div>
        </>
    }

    componentDidMount() {
        if (!this.props.match.path.endsWith("/prescription-creation")) {
            let id = parseInt(this.props.match.params.prescriptionId, 10);
            this.prescriptionRepository.getPrescription(id)
                .then(p =>
                    this.setState({ prescription: p })
                )
        } else {
            let name = this.props.match.params.username;
            this.setState({
                username: name,
                prescription: {
                    createdDate: new Date().getFullYear() + '-' + ((new Date().getMonth() < 10) ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-' + ((new Date().getDate() < 10) ? '0' + (new Date().getDate()) : (new Date().getDate()))
                }
            })
            debugger;
        }
    }
}