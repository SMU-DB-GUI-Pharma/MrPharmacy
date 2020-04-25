import React from 'react';
import { NavBar,PrescriptionList } from './index.js'

export class SearchingPage extends React.Component {

    state = {
        searchString: '',
        results: []
    }

    render() {
        return <>
            <NavBar state="dashboard" obj={this}/>
            <div className="standard-margin">
                <h2>Result</h2>
                <div className="line-break"></div>
                <PrescriptionList prescriptions={this.state.results}/>
            </div>
        </>
    }
}