import axios from "axios";
import { LOCALDATA } from "./index.js";

export class PrescriptionRepository {
  url = "http://localhost:8000";

  config = {};

  // getPrescriptions(username, sorting, isExpired) {
  //   if (!window.isLocal) {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .get(
  //           `${this.url}/prescriptions`,
  //           username,
  //           sorting,
  //           isExpired,
  //           this.config
  //         )
  //         .then((x) => resolve(x.data))
  //         .catch((x) => {
  //           reject(x);
  //         });
  //     });
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       let prescriptions = LOCALDATA.prescriptions.filter((prescription) => {
  //         return (
  //           prescription.username === username &&
  //           prescription.expired === isExpired
  //         );
  //       });
  //       resolve(prescriptions);
  //     });
  //   }
  // }

  getPrescriptions() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/prescriptions`, this.config)
        .then((x) => resolve(x.data))
        .catch((x) => {
          alert(x);
          reject(x);
        });
    });
  }

  getPrescription(id) {
    if (!window.isLocal) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${this.url}`, id, this.config)
          .then((x) => resolve(x.data))
          .catch((x) => {
            reject(x);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        let prescription = LOCALDATA.prescriptions.find((p) => p.id === id);
        resolve(prescription);
      });
    }
  }

  createPrescription(username, prescription) {
    if (!window.isLocal) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `${this.url}/prescription/addnonrecurring/:${prescription.name}/:${prescription.createdDate}/:0/:nodescription/:nocomment/:007/:${prescription.createdDate}/:626/:${prescription.createdDate}/:99/:827`,
            username,
            prescription,
            this.config
          )
          .then((x) => resolve(x.data))
          .catch((x) => {
            reject(x);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) =>
          resolve(LOCALDATA.prescriptions.push(prescription))
        );
      });
    }
  }

  editPrescription(username, prescription) {
    if (!window.isLocal) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            "placeholder for prescriptions for given user data endpoint",
            username,
            prescription,
            this.config
          )
          .then((x) => resolve(x.data))
          .catch((x) => {
            reject(x);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        //FIXME: swap the prescription with new prescirption
      });
    }
  }

  getPrescriptionsByDate() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/prescriptionSortByAddDate`, this.config)
        .then((x) => resolve(x.data))
        .catch((x) => {
          alert(x);
          reject(x);
        });
    });
  }

  getPrescriptionsByReccuring() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/prescriptionShowRecurring`, this.config)
        .then((x) => resolve(x.data))
        .catch((x) => {
          alert(x);
          reject(x);
        });
    });
  }
}
