import { PatientInterface } from "./IPatient";
import { EmployeeInterface } from "./IEmployee";
import { ClinicInterface } from "./IClinic";


export interface AppointmentInterface {
  ID: string,
  PatientID: number,
  Patient: PatientInterface,
  EmployeeID: number,
  Employee: EmployeeInterface,
  ClinicID: number,
  Clinic: ClinicInterface,
  RoomNumber: number,
  AppointmentTime: Date,
  Note: string,
}