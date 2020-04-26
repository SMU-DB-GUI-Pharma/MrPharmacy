import axios from 'axios';
import { LOCALDATA } from './index.js'

export class PrescriptionRepository {

    url = ""

    config = {

    }

    getPrescriptions(username, sorting, isExpired) {
        if (!window.isLocal) {
            return new Promise((resolve, reject) => {
                axios.get("placeholder for curr prescription for given user data endpoint", username, sorting, isExpired, this.config)
                    .then(x => resolve(x.data))
                    .catch(x => {
                        reject(x);
                    });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                let prescriptions = LOCALDATA.prescriptions.filter(prescription => {
                    return prescription.username === username && prescription.expired === isExpired;
                });
                resolve(prescriptions)
            });
        }
    }

    getPrescription(id) {
        if (!window.isLocal) {
            return new Promise((resolve, reject) => {
                axios.get("placeholder for curr prescription for given user data endpoint", id, this.config)
                    .then(x => resolve(x.data))
                    .catch(x => {
                        reject(x);
                    });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                let prescription = LOCALDATA.prescriptions.find(p => p.id === id);
                resolve(prescription)
            });
        }
    }

    createPrescription(username, prescription) {
        if (!window.isLocal) {
            return new Promise((resolve, reject) => {
                axios.post("placeholder for prescriptions for given user data endpoint", username, prescription, this.config)
                    .then(x => resolve(x.data))
                    .catch(x => {
                        reject(x);
                    });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                return new Promise((resolve, reject) => resolve(LOCALDATA.prescriptions.push(prescription)));
            });
        }
    }

    editPrescription(username, prescription) {
        if (!window.isLocal) {
            return new Promise((resolve, reject) => {
                axios.patch("placeholder for prescriptions for given user data endpoint", username, prescription, this.config)
                    .then(x => resolve(x.data))
                    .catch(x => {
                        reject(x);
                    });
            });
        }
        else {
            return new Promise((resolve, reject) => {
                //FIXME: swap the prescription with new prescirption
            });
        }
    }
}