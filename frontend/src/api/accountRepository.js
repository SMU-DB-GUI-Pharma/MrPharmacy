import axios from 'axios';

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
                    alert(x); 
                    reject(x);
                });
        });
    }

    signUp(user) {
        return new Promise((resolve, reject) => {
            axios.post("placeholder for user data endpoint", user, this.config)
                .then(x => resolve(x.data))
                .catch(x => {
                    alert(x); 
                    reject(x);
                });
        });
    }

    upadteUserInfo(user){
        return new Promise((resolve, reject) => {
            axios.patch("placeholder for user data endpoint", user, this.config)
                .then(x => resolve(x.data))
                .catch(x => {
                    alert(x); 
                    reject(x);
                });
        });
    }
}