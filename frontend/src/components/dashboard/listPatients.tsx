import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import moment from "moment";
import { PatientInterface } from "../../models/IPatient";
export const listPatients = (props:any) => (
    <Paper >
        <Table  aria-label="simple table">
          <TableHead sx={{backgroundColor:"#FDEBD0"}}>
            <TableRow >
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                HN
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                หมายเลขประจำตัวประชาชน
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                ชื่อ-นามสกุล
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                วัน/เดือน/ปีเกิด
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                อายุ
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                เพศ
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                วันที่เข้ารับการรักษา/เวลา
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                ประเภทผู้ป่วย
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                สิทธิการรักษา
              </TableCell>
              <TableCell align="center" style={{fontWeight:"bold" ,fontFamily:"Prompt"}}>
                อาการสำคัญ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.map((patient: PatientInterface) => (
              <TableRow key={patient.ID}>
                <TableCell align="center">{patient.HN}</TableCell>
                <TableCell align="center">{patient.Pid}</TableCell>
                <TableCell align="center">
                  {patient.FirstName + " " + patient.LastName}
                </TableCell>
                <TableCell align="center">
                  {moment(patient.Birthdate).format("D-MM-YYYY")}
                </TableCell>
                <TableCell align="center">{patient.Age}</TableCell>
                <TableCell align="center">{patient.Gender.Identity}</TableCell>
                <TableCell align="center">
                  {moment(patient.DateAdmit).format("D-MM-YYYY เวลา HH:mm น.")}
                </TableCell>
                <TableCell align="center">{patient.PatientType.Typename}</TableCell>
                <TableCell align="center">{patient.PatientRight.Name}</TableCell>
                <TableCell align="center">{patient.Symptom}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
)