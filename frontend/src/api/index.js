import * as mods from '../modules'
export * from './accountRepository.js'
export * from './prescriptionRepository.js'
export let LOCALDATA = {
    account: [
        new mods.User("frank", 20, "3140 Dyer St", "admin", "admin", "none")
    ],
    prescriptions: [
        new mods.Prescription(
            0, 
            "2020-06-17",
            "Frank's current prescription for some dieases",
            "pill hello world",
            "admin",
            false,
            0,
            1,
            2,
            10,
            true,
            "2030-2-19"
            ),
        new mods.Prescription(
            1, 
            "2020-06-17"
            , "Frank's past prescription for some dieases",
            "pill oof",
            "admin",
            true,
            0,
            1,
            2,
            10,
            false,
            "2030-2-19")
    ]
};