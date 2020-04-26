import {DashBoard, AccountPage, LandingPage, PrescriptionDetail, SearchingPage} from './app/index.js';

export const ROUTES = [
    {path: "/:username/dashboard", component:DashBoard},
    {path: "/:username/account", component:AccountPage},
    {path: "/signup", component:AccountPage},
    {path: "/:username/:prescriptionId", component:PrescriptionDetail},
    {path: "/:username/:searchingString", component:SearchingPage},
    {path: "/:username/prescription-creation", component:PrescriptionDetail},
    {path: "/", component:LandingPage},
]