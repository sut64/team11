import { PatientRightInterface } from './IPatientRight';
import { PatienttypeInterface } from './IPatienttype';
import { GenderInterface } from './IGender';
export interface PatientInterface {
    ID: number,
    HN: string,
    Pid: string,
    FirstName: string,
    LastName: string,
    Birthdate: Date,
    Age: number,
    DateAdmit: Date,
    Symptom: string,
    GenderID: number,
    Gender: GenderInterface,
    PatienttypeID: number,
    Patienttype: PatienttypeInterface
    PatientRightID: number,
    PatientRight: PatientRightInterface,
}