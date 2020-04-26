import React from 'react';
import { NavBar } from './index.js';
import { PrescriptionRepository } from '../api/index.js';

export class PrescriptionDetail extends React.Component {

    prescriptionRepository = new PrescriptionRepository();

    state = {
        prescription: {}
    }

    onSave() {
    }

    changeHandler = event => {
        event.persist();
        this.setState(prevState => ({
            prescription: { ...prevState.prescription, [event.target.name]: event.target.value }
        }))
    };

    render() {

        if (!this.state.prescription) {
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
        let id = parseInt(this.props.match.params.prescriptionId, 10);
        this.prescriptionRepository.getPrescription(id)
            .then(p =>
                this.setState({ prescription: p })
            )
    }
}