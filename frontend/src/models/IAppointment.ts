import { PatientInterface } from "./IPatient";
import { EmployeeInterface } from "./IEmployee";
import { ClinicsInterface } from "./IClinic";


export interface AppointmentInterface {
  ID: string,
  PatientID: number,
  Patient: PatientInterface,
  EmployeeID: number,
  Employee: EmployeeInterface,
  ClinicID: number,
  Clinic: ClinicsInterface,
  RoomNumber: number,
  AppointmentTime: Date,
  Note: string,
}