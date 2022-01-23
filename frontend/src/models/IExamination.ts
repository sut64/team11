import { PatientInterface } from "./IPatient";
import { ClinicInterface } from "./IClinic";
import { DiseaseInterface } from "./IDisease";
import { EmployeeInterface } from "./IEmployee";
//import Medicine Interface
export interface ExaminationInterface {
    ID: number,
    ChiefComplaint: string,
    Treatment: string,
    Cost: number,
    DiagnosisTime: Date,
    EmployeeID: number,
    Employee: EmployeeInterface,
    PatientID: number,
    Patient: PatientInterface,
    ClinicID: number,
    Clinic: ClinicInterface,
    DiseaseID: number,
    Disease: DiseaseInterface,
    //MedicineID: number,
    //Medicine: MedicineInterface,
  }