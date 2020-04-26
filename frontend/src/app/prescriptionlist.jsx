import React from 'react';
import {Link} from 'react-router-dom'

export const PrescriptionList = props => {

    if(!props){
        return <>Loading...</>
    }

    return <>
        <div className="close-margin">
            <ul className="list-group list-group-horizontal overflow-auto">
                {
                    props.prescriptions.map((prescription, id) => (
                        <li className="list-group-item" key={id}>
                            <Link className="btn" to={"/" + props.username + "/" + prescription.id}>
                                <h4>{prescription.name}</h4>
                                <p className="text-left mt-3">{"medication: " + prescription.medication}</p>
                                <p className="text-left mt-3">{"started date: " + prescription.createdDate}</p>
                                <p className="text-left mt-3">{"end date: " + prescription.endDate}</p>

                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    </>
}

