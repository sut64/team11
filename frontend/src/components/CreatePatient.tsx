import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { AlertTitle } from "@material-ui/lab";
import SaveIcon from "@material-ui/icons/Save";
import Divider from "@material-ui/core/Divider";
import DateFnsUtils from "@date-io/date-fns";
import Link from "@material-ui/core/Link";
import ListIcon from "@material-ui/icons/List";
import HomeIcon from "@material-ui/icons/Home";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import Select from "@material-ui/core/Select";
import { useForm } from "react-hook-form";
//import Models
import { PatientTypeInterface } from "../models/IPatienttype";
import { PatientInterface } from "../models/IPatient";
import { PatientRightInterface } from "../models/IPatientRight";
import { GenderInterface } from "../models/IGender";

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
    },
  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};
type MsgError = {
  [key: string]: string;
};
function CreatePatient() {
  const classes = useStyles();
  //set state
  const [genders, setGenders] = useState<GenderInterface[]>([]);
  const [patienttype, setPatienttype] = useState<PatientTypeInterface[]>([]);
  const [patientright, setPatientright] = useState<PatientRightInterface[]>([]);
  const [patient, setPatient] = useState<Partial<PatientInterface>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {handleSubmit} = useForm<PatientInterface>();
  const [errorMsg, setErrorMsg] = useState<MsgError>();


  const [selectedDateAdmit, setDateAdmit] = React.useState<Date | null>(
    new Date()
  );
  const [selectedBirthdate, setBirthdate] = React.useState<Date | null>(
    new Date()
  );

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
    const name = event.target.name as keyof typeof patient;
    setPatient({
      ...patient,
      [name]: event.target.value,
    });
    setErrorMsg({ ...errorMsg, [name]: "" });
    let HN = new RegExp(/^HN\d{6}$/).test(event.target.value as string);
    if (name === "HN" && !HN) {
      setErrorMsg({
        ...errorMsg,
        [name]: "HN must be prefix with HN and number of 6 digits",
      });
    }
    let Pid = new RegExp(/^[1-9]\d{12}$/).test(event.target.value as string);
    if (name === "Pid" && !Pid) {
      setErrorMsg({
        ...errorMsg,
        [name]: "Pid must be prefix with 1 to 9 and number of 12 digits",
      });
    }
    let Age = event.target.value as number;
    if (name === "Age" && (Age < 0 || Age > 120)) {
      setErrorMsg({
        ...errorMsg,
        [name]: "Age must be between 0 to 120",
      });
    }
  };

  const handleDateAdmit = (date: Date | null) => {
    setDateAdmit(date);
  };
  const handleBirthdate = (date: Date | null) => {
    setBirthdate(date);
    setErrorMsg({ ...errorMsg, Birthdate: "" });
    let Birthdate = date as Date;
    if (Birthdate > new Date()) {
      setErrorMsg({
        ...errorMsg,
        Birthdate: "Birthdate must be in the past",
      });
    }
  };

  //Get Data
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  //Get Gender
  const getGender = async () => {
    fetch(`${apiUrl}/genders`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setGenders(res.data);
        } else {
          console.log("else");
        }
      });
  };

  //Get PatientType
  const getPatienttype = async () => {
    fetch(`${apiUrl}/patienttypes`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPatienttype(res.data);
        } else {
          console.log("else");
        }
      });
  };

  //Get PatientRight
  const getPatientright = async () => {
    fetch(`${apiUrl}/patientrights`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPatientright(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getGender();
    getPatienttype();
    getPatientright();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      HN: patient.HN,
      Pid: patient.Pid,
      FirstName: patient.FirstName,
      LastName: patient.LastName,
      Birthdate: selectedBirthdate,
      Age: convertType(patient.Age),
      DateAdmit: selectedDateAdmit,
      Symptom: patient.Symptom,
      GenderID: convertType(patient.GenderID),
      PatientTypeID: convertType(patient.PatientTypeID),
      PatientRightID: convertType(patient.PatientRightID),
    };
    console.log(data);

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/patients`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setSuccess(true);
          setErrorMessage("");
          ClearForm();
        } else {
          console.error(res.error);
          setError(true);
          if (res.error.includes("patienttype")) {
            setErrorMessage("ไม่พบข้อมูล! กรุณาเลือกประเภทผู้ป่วย");
            setErrorMsg({ ...errorMsg,PatientTypeID: "กรุณาเลือกประเภทผู้ป่วย",});
          } else if (res.error.includes("patientright")) {
            setErrorMessage("ไม่พบข้อมูล! กรุณาเลือกสิทธิการรักษาของผู้ป่วย");
            setErrorMsg({...errorMsg,PatientRightID: "กรุณาเลือกสิทธิการรักษาของผู้ป่วย",});
          } else if (res.error.includes("Gender")) {
            setErrorMessage("ไม่พบข้อมูล! กรุณาเลือกเพศของผู้ป่วย");
            setErrorMsg({ ...errorMsg, GenderID: "กรุณาเลือกเพศของผู้ป่วย" });
          } else if (res.error.includes("HN")) {
            setErrorMessage(`${res.error.split(" ")[1]} รูปแบบไม่ถูกต้อง! หมายเลขประจำตัวผู้ป่วยต้องขึ้นด้วย HN และตามด้วยตัวเลข 6 หลัก`);
          } else if (res.error.includes("Pid")) {
            setErrorMessage(`${res.error.split(" ")[1]} รูปแบบไม่ถูกต้อง! หมายเลขประจำตัวประชาชนประกอบด้วยตัวเลข 13 หลักเท่านั้นและต้องไม่ขึ้นด้วย 0`);
          } else if (res.error.includes("Age")) {
            setErrorMessage(`อายุ ${res.error.split(" ")[1]} ปี ไม่ถูกต้อง! อายุผู้ป่วยต้องอยู่ในช่วงตั้งแต่ 0 ถึง 120 ปี`);
          } else if (res.error.includes("Birthdate")) {
            setErrorMessage(`วันเดือนปีเกิดไม่ถูกต้อง! ต้องไม่เกินวันที่ในปัจจุบัน`);
          } else setErrorMessage(res.error);
        }
      });
  }

  // function clear form after submit success
  const ClearForm = () => {
    setPatient({
      HN: "",
      Pid: "",
      FirstName: "",
      LastName: "",
      Age: 0,
      GenderID: 0,
      PatientTypeID: 0,
      PatientRightID: 0,
      Symptom: "",
    });
    setDateAdmit(new Date());
    setBirthdate(new Date());
  };

  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={1500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          <AlertTitle>Success</AlertTitle>
          การบันทึกสำเร็จ —
          <strong>
            <Link href="/listPatient" style={{ color: "#fff" }}>
              ดูรายชื่อผู้ป่วย
            </Link>
          </strong>
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          <AlertTitle>Error</AlertTitle>
          ลงทะเบียนไม่สำเร็จ : {errorMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(submit)}>
      <Paper className={classes.paper}>
        <Typography variant="h5" color="primary">
          <p>ระบบบันทึกการรับเข้าผู้ป่วย</p>
        </Typography>
        <Divider />

        <div style={{ marginBottom: 5 }}>
          <Grid container spacing={3} style={{ marginTop: 2 }}>
            <Grid item xs={3}>
              <p className={classes.text}>หมายเลขประจำตัวผู้ป่วย</p>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                inputProps={{
                  name: "HN",
                }}
                placeholder="กรุณากรอกเลขประจำตัวผู้ป่วย"
                value={patient.HN}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                size="small"
                error={Boolean(errorMsg?.HN)}
                helperText={errorMsg?.HN}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <p className={classes.text}>วันที่เข้ารับการรักษา</p>
            </Grid>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  fullWidth
                  name="DateAdmit"
                  inputVariant="outlined"
                  size="small"
                  format="dd/MM/yyyy HH:mm"
                  value={selectedDateAdmit}
                  onChange={handleDateAdmit}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <p className={classes.text}>ประเภทผู้ป่วย</p>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  native
                  value={patient.PatientTypeID}
                  onChange={handleChange}
                  inputProps={{ name: "PatientTypeID" }}
                  error={Boolean(errorMsg?.PatientTypeID)}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกประเภทผู้ป่วย
                  </option>
                  {patienttype.map((item: PatientTypeInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Typename}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider />
        </div>
        <div style={{ marginBottom: 5 }}>
          <Grid container spacing={3} style={{ marginTop: 2 }}>
            <Grid item xs={3}>
              <p className={classes.text}>หมายเลขประจำตัวประชาชน</p>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                inputProps={{ name: "Pid" }}
                value={patient.Pid}
                onChange={handleChange}
                placeholder="กรุณากรอกเลขบัตรประจำตัวประชาชน"
                variant="outlined"
                fullWidth
                size="small"
                error={Boolean(errorMsg?.Pid)}
                helperText={errorMsg?.Pid}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              {" "}
              <p className={classes.text}>ชื่อ</p>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                inputProps={{ name: "FirstName" }}
                value={patient.FirstName}
                placeholder="กรุณากรอกชื่อ"
                onChange={handleChange}
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item>
              {" "}
              <p className={classes.text}>นามสกุล</p>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                inputProps={{ name: "LastName" }}
                value={patient.LastName}
                placeholder="กรุณากรอกนามสกุล"
                onChange={handleChange}
                variant="outlined"
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <p className={classes.text}>เพศของผู้ป่วย</p>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  native
                  value={patient.GenderID}
                  onChange={handleChange}
                  inputProps={{
                    name: "GenderID",
                  }}
                  error={Boolean(errorMsg?.GenderID)}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกเพศของผู้ป่วย
                  </option>
                  {genders.map((item: GenderInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Identity}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <p className={classes.text}>วัน/เดือน/ปีเกิด</p>
            </Grid>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  name="Birthdate"
                  inputVariant="outlined"
                  size="small"
                  format="dd/MM/yyyy"
                  value={selectedBirthdate}
                  onChange={handleBirthdate}
                  error={Boolean(errorMsg?.Birthdate)}
                  helperText={errorMsg?.Birthdate}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              {" "}
              <p className={classes.text}>อายุ</p>
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                inputProps={{ name: "Age", min: 0}}
                value={patient.Age}
                placeholder="กรุณากรอกอายุ"
                onChange={handleChange}
                variant="outlined"
                type="number"
                fullWidth
                size="small"
                error={Boolean(errorMsg?.Age)}
                helperText={errorMsg?.Age}
              />
            </Grid>
          </Grid>
          <Divider />
        </div>
        <div style={{ marginBottom: 5 }}>
          <Grid container spacing={3} style={{ marginTop: 3 }}>
            <Grid item xs={3}>
              <p className={classes.text}>สิทธิการรักษาพยาบาล</p>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  native
                  value={patient.PatientRightID}
                  onChange={handleChange}
                  inputProps={{
                    name: "PatientRightID",
                  }}
                  error={Boolean(errorMsg?.PatientRightID)}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกสิทธิการรักษา
                  </option>
                  {patientright.map((item: PatientRightInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              {" "}
              <p className={classes.text}>อาการสำคัญ</p>
            </Grid>
            <Grid item xs={9}>
              <TextField
                inputProps={{ name: "Symptom" }}
                value={patient.Symptom || ""}
                placeholder="-"
                onChange={handleChange}
                variant="outlined"
                multiline
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </div>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={2}>
            <Button
              style={{ backgroundColor: "#ff4081", color: "white" }}
              variant="contained"
              size="medium"
              //onClick={submit}
              type="submit"
              startIcon={<SaveIcon />}
            >
              บันทึกข้อมูล
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              style={{ backgroundColor: "#7c4dff", color: "white" }}
              variant="contained"
              size="medium"
              startIcon={<ListIcon />}
              component={RouterLink}
              to="/listPatient"
            >
              รายชื่อผู้ป่วย
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              style={{ backgroundColor: "#03a9f4", color: "white" }}
              component={RouterLink}
              to="/"
              variant="contained"
              size="medium"
              startIcon={<HomeIcon />}
            >
              หน้าแรก
            </Button>
          </Grid>
        </Grid>
      </Paper>
      </form>
    </Container>
  );
}
export default CreatePatient;
