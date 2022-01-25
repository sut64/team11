import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { PatientInterface } from "../models/IPatient";
import moment from "moment";
import HomeIcon from "@material-ui/icons/Home";
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 800,
    },
    tableSpace: {
      marginTop: 20,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    title: {
      color: "#000000",
      fontSize: "1rem",
      //fontWeight: "bold",
  },

  })
);

function ListPatient() {
  const classes = useStyles();
  const [patients, setPatients] = useState<PatientInterface[]>([]);

  const getPatients = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setPatients(res.data);
        } else {
          console.log("else");
        }
      });
  };
  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div>
      <Box display="flex">
        <Box flexGrow={1}>
          <Typography component="h2" variant="h4" color="primary">
            รายชื่อผู้ป่วย
          </Typography>
        </Box>
        <Box>
          <Button
            component={RouterLink}
            to="/CreatePatient"
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
          >
            ลงทะเบียนผู้ป่วยใหม่
          </Button>
        </Box>
        <Box>
          <Button style={{marginLeft:20}}
            component={RouterLink}
            to="/"
            variant="contained"
            size="medium"
            startIcon={<HomeIcon/>}
            color="primary"
          >
            หน้าแรก
          </Button>
        </Box>
        
      </Box>
      <p></p>
      <Paper className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow >
              <TableCell align="center" className={classes.title}>
                HN
              </TableCell>
              <TableCell align="center" className={classes.title}>
                หมายเลขประจำตัวประชาชน
              </TableCell>
              <TableCell align="center" className={classes.title}>
                ชื่อ-นามสกุล
              </TableCell>
              <TableCell align="center" className={classes.title}>
                วัน/เดือน/ปีเกิด
              </TableCell>
              <TableCell align="center" className={classes.title}>
                อายุ
              </TableCell>
              <TableCell align="center" className={classes.title}>
                เพศ
              </TableCell>
              <TableCell align="center" className={classes.title}>
                วันที่เข้ารับการรักษา/เวลา
              </TableCell>
              <TableCell align="center" className={classes.title}>
                ประเภทผู้ป่วย
              </TableCell>
              <TableCell align="center" className={classes.title}>
                สิทธิการรักษา
              </TableCell>
              <TableCell align="center" className={classes.title}>
                อาการสำคัญ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient: PatientInterface) => (
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
    </div>
  );
}
export default ListPatient;