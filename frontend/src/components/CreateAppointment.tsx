import React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import Snackbar from '@material-ui/core/Snackbar';
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";

import { EmployeeInterface } from "../models/IEmployee";
import { ClinicInterface } from "../models/IClinic";
import { PatientInterface } from "../models/IPatient";
import { AppointmentInterface } from "../models/IAppointment";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { AlertTitle } from '@material-ui/lab';
import { useForm } from "react-hook-form";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    text: {
      color: "#000000",
      fontSize: "1rem",
    }

  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function AppointmentCreate() {

  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [clinics, setClinics] = useState<ClinicInterface[]>([]);
  const [patients, setPatients] = useState<PatientInterface[]>([]);
  const [appointment, setAppointment] = useState<Partial<AppointmentInterface>>({});
  const [doctors, setDoctors] = useState<EmployeeInterface[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, watch, formState: { errors }, } = useForm<AppointmentInterface>();


  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof appointment;
    setAppointment({
      ...appointment,
      [name]: event.target.value,
    });

  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleInputChange = (

    event: React.ChangeEvent<{ id?: string; value: any }>

  ) => {

    const name = event.target.id as keyof typeof appointment;

    const { value } = event.target;

    setAppointment({ ...appointment, [name]: value });

  };

  //Get Data
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
  };

  const getClinic = async () => {
    fetch(`${apiUrl}/clinics`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setClinics(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPatient = async () => {
    fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPatients(res.data);
        } else {
          console.log("else");
        }
      });
  };
  console.log("Patient", doctors);

  const getDoctor = async () => {
    fetch(`${apiUrl}/employeerole/1`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setDoctors(res.data);
        } else {
          console.log("else");
        }
      });
  };
  console.log("Doctor", doctors);

  useEffect(() => {
    getClinic();
    getPatient();
    getDoctor();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      PatientID: convertType(appointment.PatientID),
      EmployeeID: convertType(appointment.EmployeeID),
      ClinicID: convertType(appointment.ClinicID),
      RoomNumber: convertType(appointment.RoomNumber),
      AppointmentTime: selectedDate,
      Note: appointment.Note ?? "",
    };
    console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/appointments`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกได้")
          setSuccess(true);
          setErrorMessage("")
          ClearForm();
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
          if (res.error.includes("RoomNumber more than 0")) {
            setErrorMessage("กรุณากรอกหมายเลขห้องตรวจที่มีค่ามากกว่า 0")
          } else if (res.error.includes("RoomNumber cannot be blank")) {
            setErrorMessage("กรุณากรอกหมายเลขห้องตรวจ")
          } else if (res.error.includes("AppointmentTime must be in the future")) {
            setErrorMessage("กรุณาเลือกวันเวลานัดหมายที่เป็นอนาคต")
          } else if (res.error.includes("patient not found")) {
            setErrorMessage("กรุณาเลือกหมายเลขบัตรประชาชนผู้ป่วย")
          } else if (res.error.includes("doctor not found")) {
            setErrorMessage("กรุณาเลือกเเพทย์")
          } else if (res.error.includes("clinic not found")) {
            setErrorMessage("กรุณาเลือกคลินิก")
          } else if (res.error.includes("Note cannot be blank")) {
            setErrorMessage("กรุณากรอกหมายเหตุการนัด")
          }else {
            setErrorMessage(res.error);
          }
        }
      });
  }

  // function clear form after submit success
  const ClearForm = () => {
    setAppointment({
      PatientID: 0,
      EmployeeID: 0,
      ClinicID: 0,
      RoomNumber: 0,
      Note: "",
    });
    setSelectedDate(new Date());
  };

  return (

    <Container className={classes.container} maxWidth="md" >
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          <AlertTitle>Success</AlertTitle>
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          <AlertTitle>Error</AlertTitle>
          บันทึกข้อมูลไม่สำเร็จ: {errorMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(submit)}>
        <Paper className={classes.paper}>
          <Box display="flex" >
            <Box flexGrow={1}>

              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom

              >
                บันทึกรายการนัดหมาย
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Grid container spacing={3} className={classes.root}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <p style={{ color: "#006A7D", fontSize: "10" }}>หมายเลขบัตรประชาชน</p>
                <Select
                  native
                  value={appointment.PatientID}
                  onChange={handleChange}
                  inputProps={{
                    name: "PatientID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกหมายเลขบัตรประชาชน
                  </option>
                  {patients.map((item: PatientInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Pid}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} >
              <p></p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <p style={{ color: "#006A7D", fontSize: "10" }}>แพทย์</p>
                <Select
                  native
                  value={appointment.EmployeeID}
                  onChange={handleChange}
                  inputProps={{
                    name: "EmployeeID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกแพทย์
                  </option>
                  {doctors.map((item: EmployeeInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <p style={{ color: "#006A7D", fontSize: "10" }}>คลินิก</p>
                <Select
                  native
                  value={appointment.ClinicID}
                  onChange={handleChange}
                  inputProps={{
                    name: "ClinicID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกคลินิก
                  </option>
                  {clinics.map((item: ClinicInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.ClinicName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <p style={{ color: "#006A7D", fontSize: "10" }}>หมายเลขห้อง :</p>
                <TextField
                  id="RoomNumber"
                  variant="outlined"
                  type="number"
                  size="medium"
                  value={appointment.RoomNumber}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <p style={{ color: "#006A7D", fontSize: "10" }}>วันที่และเวลานัดหมาย</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    name="AppointmentTime"
                    value={selectedDate}
                    onChange={handleDateChange}
                    label="กรุณาเลือกวันที่และเวลา"
                    minDate={new Date("2018-01-01T00:00")}
                    format="yyyy/MM/dd hh:mm a"
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <p style={{ color: "#006A7D", fontSize: "10" }}>หมายเหตุ :</p>
                <TextField
                  id="Note"
                  variant="outlined"
                  type="string"
                  size="medium"
                  value={appointment.Note || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} >
              <p></p>
            </Grid>
            <Grid item xs={12}>
              <Button
                component={RouterLink}
                to="/appointment"
                variant="contained"
              >
                กลับ
              </Button>
              <Button
                style={{ float: "right" }}
                variant="contained"
                onClick={submit}
                color="primary"
              >
                บันทึก
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Container>
  );
}
export default AppointmentCreate;