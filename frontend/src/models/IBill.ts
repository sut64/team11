import { PatientRightInterface } from "./IPatientRight";
import { PaytypeInterface } from "./IPaytype";
import { BillItemInterface } from "./IBillItem";
import { EmployeeInterface } from "./IEmployee";

export interface BillInterface {
    ID : number,

    PatientRightID : number,
    PatientRight : PatientRightInterface,

    PaytypeID : number,
    Paytype : PaytypeInterface,

    BillTime : Date

    Total : number,

    Telephone : string,
    
    EmployeeID : number,
    Employee : EmployeeInterface,

    BillItems : BillItemInterface[],

}