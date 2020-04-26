import React from 'react';
import { NavBar } from './index.js';
import { AccountRepository } from '../api/index.js'
import { Redirect } from 'react-router-dom'

export class LandingPage extends React.Component {

    accountRepository = new AccountRepository();

    state = {
        username: '',
        password: '',
    }

    onLogIn() {
        this.accountRepository.logIn({ username: this.state.username, password: this.state.password })
            .then(user => {
                this.setState({ redirect: '/' + this.state.username + '/dashboard' })
            })
            .catch(x => {
                alert("Log in failed")
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return <>
            <NavBar state={'landing'} />
            <div className="standard-margin">
                <form name="credentials">
                    <div className="form-group">
                        <label htmlFor="username">User Name:</label>
                        <input type="text" className="form-control" id="username" name="username" onChange={e => this.setState({ username: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={e => this.setState({ password: e.target.value })} />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={e => this.onLogIn()}>Log In</button>
                </form>
            </div>
        </>
    }
}

