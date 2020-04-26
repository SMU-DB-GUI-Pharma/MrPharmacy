import axios from 'axios';
import { LOCALDATA } from './index.js';

export class AccountRepository {

    url = ""

    config = {

    }

    logIn(credential) {
        return new Promise((resolve, reject) => {
            axios.get("placeholder for user data endpoint", credential.username, this.config)
                .then(x => {
                    if (x.data.password === credential.password) {
                        resolve(x.data);
                    } else {
                        reject(x);
                    }
                })
                .catch(x => {
                    alert("api fetch content failed with: \n" + x + "\n swicted to local data");
                    window.isLocal = true;
                    let foundUser = LOCALDATA.account.find(user => user.username === credential.username)
                    if (foundUser && foundUser.password === credential.password) {
                        resolve(foundUser);
                    } else {
                        reject(x);
                    }
                });
        });
    }

    signUp(user) {
        if (!window.isLocal) {
            return new Promise((resolve, reject) => {
                axios.post("placeholder for user data endpoint", user, this.config)
                    .then(x => resolve(x.data))
                    .catch(x => {
                        alert(x);
                    });
            });
        } else {
            return new Promise((resolve, reject) => resolve(LOCALDATA.account.push(user)));
        }
    }

    upadteUserInfo(user) {
        if (!window.isLocal) {
            return new Promise((resolve, reject) => {
                axios.patch("placeholder for user data endpoint", user, this.config)
                    .then(x => resolve(x.data))
                    .catch(x => {
                        alert(x);
                    });
            });
        } else {
            return new Promise((resolve, reject) => {
                let foundIndex = LOCALDATA.account.findIndex(x => x.username === user.username);
                resolve(LOCALDATA.account.splice(foundIndex, 1, user));
            })
        }
    }
}