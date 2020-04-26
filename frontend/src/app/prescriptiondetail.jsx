import React from 'react';
import { NavBar } from './index.js';
import { Prescription, Medication } from '../modules'

export class PrescriptionDetail extends React.Component {

    state = {
        prescription: new Prescription(
            "sample Prescription",
            [new Medication("helloPill", 30, true, 1, 3), new Medication("worldPill", 40, false, 1, 3)],
            new Date()
        )
    }

    render() {
        return <>
            <NavBar />
            <div className="close-margin">
                <h2>{this.state.prescription.name}</h2>
                <div className="line-break"></div>
                <form name="prescription" className="mt-3">
                    <div className="form-group">
                        <label htmlFor="name">Prescription name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={this.state.prescription.name} disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="medications">Prescription Medications:</label>
                        <ul id="medications" className="list-group">
                            {
                                this.state.prescription.medications.map((medication, id) => (
                                    <li key={id} className="list-group-item">
                                        <label htmlFor={"med-name" + id} >medication name:</label>
                                        <input type="text" className="form-control" id={"med-name" + id} value={medication.name} disabled />
                                        <div className="row mt-4">
                                            <div className="col">
                                                <label htmlFor={"med-price" + id}>medication price:</label>
                                                <input type="number" className="ml-3" id={"med-price" + id} value={medication.price} disabled />
                                            </div>
                                            <div className="col">
                                                <label htmlFor={"med-isrecurring" + id}>is recurring?</label>
                                                <input type="checkbox" className="ml-3" id={"med-isrecurring" + id} checked={medication.isRecurring} disabled />
                                            </div>
                                            <div className="col text-right">
                                                <button type="button" className="btn btn-sm btn-primary" onClick={()=>console.log("FIXME: route to see similary medication page")}>see similar medication</button>
                                            </div>
                                        </div>
                                    </li>
                                )
                                )
                            }
                        </ul>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Prescription created Date:</label>
                        <input type="date" className="form-control" id="name" name="name" value={this.state.prescription.createdDate} disabled />
                    </div>
                </form>
                <div className="text-right mt-4">
                    <button type="button" className="btn btn-lg btn-primary" onClick={() => console.log("FIXME: update form to active and add more items to changeable")}>Edit Prescription</button>
                    <button type="button" className="btn btn-lg btn-primary ml-5" onClick={() => console.log("FIXME: route to pick pharmacy page")}>Pick Pharmacy</button>
                </div>
            </div>
        </>
    }
}