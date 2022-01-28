import { PatientInterface } from "./IPatient";
import { MedicineInterface } from "./IMedicine";
import { EmployeeInterface } from "./IEmployee";

export interface PayMedicineInterface {
    ID: number,
    Pid: string
    Prescription: string,
    PayMedicineTime: Date,
    EmployeeID: number,
    Employee: EmployeeInterface,
    PatientID: number,
    Patient: PatientInterface,
    MedicineID: number,
    Cost: number,
    Medicine: MedicineInterface,
  }