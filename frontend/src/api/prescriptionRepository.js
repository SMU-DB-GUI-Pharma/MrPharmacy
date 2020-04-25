import axios from 'axios';

export class PrescriptionRepository {

    url = ""

    config = {

    }

    getCurrentPrescription(username,sorting){
        return new Promise((resolve, reject) => {
            axios.get("placeholder for curr prescription for given user data endpoint", sorting, this.config)
                .then(x => resolve(x.data))
                .catch(x => {
                    alert(x); 
                    reject(x);
                });
        });
    }

    getPastPrescription(username,sorting){
        return new Promise((resolve, reject) => {
            axios.get("placeholder for past prescription for given user endpoint", sorting, this.config)
                .then(x => resolve(x.data))
                .catch(x => {
                    alert(x); 
                    reject(x);
                });
        });
    }

}