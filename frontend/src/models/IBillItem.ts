import { ExaminationInterface } from "./IExamination";
import { BillInterface } from "./IBill";
export interface BillItemInterface {

    ID : number,
    
    BillID : number,
    Bill : BillInterface,

    ExaminationID : number,
    Examination : ExaminationInterface
}