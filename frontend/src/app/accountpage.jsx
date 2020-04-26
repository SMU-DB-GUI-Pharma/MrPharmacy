import React from 'react';
import { NavBar } from './index.js';
import { User } from '../modules';
import { AccountRepository } from '../api/index.js';
import { Redirect } from 'react-router-dom'


export class AccountPage extends React.Component {

    accountRepository = new AccountRepository();

    state = {
        user: {},
        name: '',
        age: 0,
        address: '',
        insuranceid: 0,
        username: '',
        password: ''
    }

    onSave() {
        let update = new User(this.state.name, this.state.age, this.state.address, this.state.username, this.state.password, this.state.insuranceid)
        this.setState({ user: update });
        this.accountRepository.upadteUserInfo(update);
    }

    onSignUp() {
        this.accountRepository.signUp(new User(this.state.name, this.state.age, this.state.address, this.state.username, this.state.password, this.state.insuranceid))
        this.setState({ redirect: '/' + this.state.username + '/dashboard' })
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        let navbar;

        if (this.props.match.path === "/signup") {
            navbar = <NavBar state={'signup'} obj={this} />
        } else {
            navbar = <NavBar state={'account'} obj={this} />
        }

        return <>
            {navbar}
            <form name="user-information" className="form-group standard-margin">
                <div className="row">
                    <div className="col">
                        <label htmlFor="name">Name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={this.state.user.name} onChange={e => this.setState({ name: e.target.value })} />
                    </div>
                    <div className="col">
                        <label htmlFor="age">Age:</label>
                        <input type="number" className="form-control" id="age" name="age" value={this.state.user.age} onChange={e => this.setState({ age: e.target.value })} />
                    </div>
                </div>
                <div className="mt-2">
                    <label htmlFor="insuranceid">Insurance Information:</label>
                    <input type="number" name="insuranceid" id="insuranceid" className="form-control" value={this.state.user.insuranceid} onChange={e => this.setState({ insuranceid: e.target.value })}></input>
                </div>
                <div className="mt-2">
                    <label htmlFor="address">Address:</label>
                    <textarea name="address" id="address" rows="5" className="form-control" value={this.state.user.address} onChange={e => this.setState({ address: e.target.value })}></textarea>
                </div>

                <div className="row mt-5">
                    <div className="col">
                        <label htmlFor="username">UserName:</label>
                        <input type="text" className="form-control" id="username" name="username" value={this.state.user.username} onChange={e => this.setState({ username: e.target.value })} />
                    </div>
                    <div className="col">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" name="password" value={this.state.user.password} onChange={e => this.setState({ password: e.target.value })} />
                    </div>
                </div>
            </form>
        </>
    }
}