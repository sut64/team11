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
import MenuItem from '@material-ui/core/MenuItem';
import SaveIcon from '@material-ui/icons/Save';
import Divider from "@material-ui/core/Divider";
import Snackbar from '@material-ui/core/Snackbar';
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";

import { EmployeeInterface } from "../models/IEmployee";
import { ClinicInterface } from "../models/IClinic";
import { PatientInterface } from "../models/IPatient";
import { ClinicLogInterface } from "../models/IClinicLog";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AllInboxIcon from '@material-ui/icons/AllInbox';


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

function ClinicLogCreate() {

  const classes = useStyles();
  const [SendingTime, setSendingTime] = React.useState<Date | null>(new Date(),);
  const [clinics, setClinics] = useState<ClinicInterface[]>([]);
  const [patients, setPatients] = useState<PatientInterface[]>([]);
  const [cliniclog, setClinicLog] = useState<Partial<ClinicLogInterface>>({});
  const [nurse, setNurse] = useState<EmployeeInterface>();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


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
    const name = event.target.name as keyof typeof cliniclog;
    setClinicLog({
      ...cliniclog,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSendingTime(date);
  };

  const handleInputChange = (

    event: React.ChangeEvent<{ id?: string; value: any }>

  ) => {

    const id = event.target.id as keyof typeof cliniclog;

    const { value } = event.target;

    setClinicLog({ ...cliniclog, [id]: value });

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
  console.log("Patient",nurse);
  
  const getNurse = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/employee/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        cliniclog.EmployeeID = res.data.ID
        if (res.data) {
          console.log(res.data)
          setNurse(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getClinic();
    getPatient();
    getNurse();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      PatientID: convertType(cliniclog.PatientID),
      EmployeeID: convertType(cliniclog.EmployeeID),
      ClinicID: convertType(cliniclog.ClinicID),
      ClinicRoom: convertType(cliniclog.ClinicRoom),
      SendingTime: SendingTime,
      Note: cliniclog.Note ?? "",
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

    fetch(`${apiUrl}/cliniclogs`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกสำเร็จ")
          setSuccess(true);
        } else {
          console.log("บันทึกไม่ไม่สำเร็จ")
          setError(true);
        }
      });
  }

  return (

    <Container className={classes.container} maxWidth="md" >
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex" >
          <Box flexGrow={1}>

            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
              
            >
               บันทึกการส่งตรวจคลินิก
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{color:"#006A7D",fontSize: "10"}}>คนไข้</p>
              <Select
                native
                value={cliniclog.PatientID}
                onChange={handleChange}
                inputProps={{
                  name: "PatientID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกคนไข้
                </option>
                {patients.map((item: PatientInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.FirstName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{color:"#006A7D",fontSize: "10"}}>คลินิก</p>
              <Select
                native
                value={cliniclog.ClinicID}
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
              <p style={{color:"#006A7D",fontSize: "10"}}>หมายเลขห้อง :</p>
              <TextField
                id="ClinicRoom"
                variant="outlined"
                type="number"
                size="medium"
                value={cliniclog.ClinicRoom}
                onChange={handleInputChange}
                inputProps={{min:0}}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{color:"#006A7D",fontSize: "10"}}>วันที่และเวลานัดหมาย</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="SendingTime"
                  value={SendingTime}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2018-01-01T00:00")}
                  format="dd/MM/yyyy"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{color:"#006A7D",fontSize: "10"}}>หมายเหตุ :</p>
              <TextField
                id="Note"
                variant="outlined"
                type="string"
                size="medium"
                value={cliniclog.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{color:"#006A7D",fontSize: "10"}}>เจ้าหน้าที่</p>
              <Select
                native
                value={cliniclog.EmployeeID}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "EmployeeID",
                }}
              >
                <option value={nurse?.ID} key={nurse?.ID}>
                  {nurse?.Name}
                </option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} >
            <p></p>
          </Grid>
          
        </Grid>
      </Paper>
      <br/>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={3}>
              <Button
                component={RouterLink}
                to="/cliniclog"
                variant="contained"
                color="primary"
              >
                ประวัติ
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
    </Container>
  );
}
export default ClinicLogCreate;