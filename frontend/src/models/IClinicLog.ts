import { ClinicInterface } from './IClinic';
import { PatientInterface } from './IPatient';
import { EmployeeInterface } from './IEmployee';
export interface ClinicLog {
    ID: number,
    Note: string,
    ClinicRoom: number,
    SendingTime: Date,
    ClinicID: number,
    Clinic: ClinicInterface,
    PatientID: number,
    Patient: PatientInterface
    EmployeeID: number,
    Employee: EmployeeInterface,
}