import React from 'react';
import {Link} from 'react-router-dom'

export const PrescriptionList = props => {

    return <>
        <div className="close-margin">
            <ul className="list-group list-group-horizontal overflow-auto">
                {
                    props.prescriptions.map((prescription, id) => (
                        <li className="list-group-item" key={id}>
                            <Link className="btn" to={"/" + props.username + "/" + prescription.name}>
                                <h4>{prescription.name}</h4>
                                {
                                    prescription.medications.map((medication, id) => (
                                        <p key={id} className="text-left" >{medication.name}</p>
                                    ))}
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    </>
}

