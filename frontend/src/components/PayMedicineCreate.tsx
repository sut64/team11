import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {MuiPickersUtilsProvider,KeyboardDatePicker,} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MenuItem, Select } from "@material-ui/core";

import { EmployeeInterface } from "../models/IEmployee";
import { PatientInterface } from "../models/IPatient";
import { MedicineInterface } from "../models/IMedicine";
import { PayMedicineInterface } from "../models/IPayMedicine";


function Alert(props: AlertProps) {

 return <MuiAlert elevation={6} variant="filled" {...props} />;

}

const useStyles = makeStyles((theme: Theme) =>

 createStyles({

   root: {flexGrow: 1},
   container: {marginTop: theme.spacing(2)},
   paper: {padding: theme.spacing(2),color: theme.palette.text.secondary},
 })
);

function PayMedicineCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [pharmacist, setpharmacist] = useState<EmployeeInterface>();
  const [patient, setPatient] = useState<PatientInterface[]>([]);
  const [Medicine, setMedicine] = useState<MedicineInterface[]>([]);

  const [paymedicine, setPayMedicine] = useState<Partial<PayMedicineInterface>>({});

 const [success, setSuccess] = React.useState(false);
 const [error, setError] = React.useState(false);
 
 const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
   if (reason === "clickaway") {
     return;
   }
   setSuccess(false);

   setError(false);
 };

 const apilUrl = "http://localhost:8080";
    const requestOptions = {
        method : "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"},
    };

 const handleDateChange = (date: Date | null) => {
   setSelectedDate(date);
 };

const handleChange = (
  event: React.ChangeEvent<{ name?: string; value: unknown}>
) => {
  const name = event.target.name as keyof typeof paymedicine;
  setPayMedicine({... paymedicine,[name]: event.target.value,});
};

 const handleInputChange = (
   event: React.ChangeEvent<{ id?: string; value: any }>
 ) => {
   const id = event.target.id as keyof typeof PayMedicineCreate;
   const { value } = event.target;
   setPayMedicine({ ...paymedicine, [id]: value });

 };

 const getPatient = async () =>{
  fetch(`${apilUrl}/patients`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
          if (res.data){
              setPatient(res.data);
          }
          else{
              console.log("else");
          }
      });
};

  const getMedicine = async () =>{
        fetch(`${apilUrl}/medicines`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setMedicine(res.data);
                }
                else{
                    console.log("else");
                }
            });
};

 const getEmployee = async () =>{
  let uid = localStorage.getItem("uid");
  console.log(uid);
  fetch(`${apilUrl}/employee/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
          paymedicine.EmployeeID = res.data.ID
          if (res.data){
              setpharmacist(res.data);
          }
          else{
              console.log("else");
          }
      });
};

  useEffect(() => {
   getPatient();
   getMedicine();
   getEmployee();
  },[]);

 const convertType = (data: string | number | undefined) => {
  let val = typeof data === "string" ? parseInt(data) : data;
  return val;
};
 function submit() {
   let data = {
     EmployeeID : convertType(paymedicine.EmployeeID),
     PatientID : convertType(paymedicine.PatientID),
     MedicineID : convertType(paymedicine.MedicineID),
     Cost: convertType(paymedicine.Cost),
     PayMedicineTime: selectedDate,

   };

   console.log(data)
   const requestOptionsPost = {

     method: "POST",

     headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
     "Content-Type": "application/json" },
     body: JSON.stringify(data),

   };

  fetch(`${apilUrl}/paymedicines`, requestOptionsPost)
       .then((response) => response.json())
       .then((res) => {
         if (res.data) {
           console.log("บันทึกได้")
           setSuccess(true);
         } else {
           console.log("บันทึกไม่ได้")
           setError(true);
         }
       });
   }

 return (
   <Container className={classes.container} maxWidth="md">
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
       <Box display="flex">
         <Box flexGrow={1}>
           <Typography
             component="h2"
             variant="h6"
             color="primary"
             gutterBottom
           >
             บันทึกการจ่ายยา
           </Typography>
         </Box>
       </Box>
       <Divider/>
      <Grid container spacing = {3} className={classes.root}>
        <Grid item xs={6}>
        <p>ผู้ป่วย</p>
        <FormControl fullWidth variant="outlined" size="medium">
        <Select
          value={paymedicine.PatientID}
          defaultValue = {0}
          onChange={handleChange}
          inputProps={{name: "PatientID"}}
        > 
        <MenuItem value={0} key={0}>
           กรุณาเลือกผู้ป่วย
            </MenuItem>
            {patient.map((item: PatientInterface) => (
            <MenuItem value={item.ID} key={item.ID}>
           {item.FirstName} {item.LastName}
           </MenuItem>
        ))}
      </Select>
      </FormControl>
      </Grid>  
           
            <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size = "small">
            <p> ยาที่ได้รับ </p>
            <Select
              id="MedicineID"
              value={paymedicine.MedicineID}
              defaultValue = {0}
              onChange={handleChange}
              inputProps={{name: "MedicineID"}}
            >
            <MenuItem value={0} key={0}>
            เลือกยา
            </MenuItem>
              {Medicine.map((item: MedicineInterface) => (
              <MenuItem value={item.ID} key={item.ID}>
                {item.Name}
              </MenuItem>
              ))}
            </Select>
            </FormControl>
            </Grid>
            <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
            <p> ค่ายา </p>
            <TextField
              id="Cost"
              variant="outlined"
              type="number"
              size="medium"
              value={paymedicine.Cost}
              onChange={handleInputChange}
          />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <p>เภสัชกร</p>
          <FormControl fullWidth variant="outlined" size="medium">
          <Select
              native
              disabled
              id="EmployeeID"
              value={paymedicine.ID}
              defaultValue = {0}
              onChange={handleChange}
              inputProps={{name: "EmployeeID"}}
            > 
              <option value={pharmacist?.ID} key={pharmacist?.ID}>{pharmacist?.Name}
              </option>

              </Select>
              </FormControl>
              </Grid>
              <Grid item xs={6}>
           <FormControl fullWidth variant="outlined">
             <p>วันที่จ่ายยา</p>
             <MuiPickersUtilsProvider utils={DateFnsUtils}>
               <KeyboardDatePicker
                 margin="normal"
                 id="Pay_DateTime"
                 format="yyyy-MM-dd"
                 value={selectedDate}
                 onChange={handleDateChange}
                 KeyboardButtonProps={{
                   "aria-label": "change date",
                 }}
               />
             </MuiPickersUtilsProvider>
           </FormControl>
         </Grid>
         <Grid item xs={12}>
           <Button component={RouterLink} to="/paymedicine" variant="contained">
             กลับ
           </Button>
           <Button
             style={{ float: "right" }}
             onClick={submit}
             variant="contained"
             color="primary"
           >
             บันทึกข้อมูลการจ่ายยา
           </Button>
         </Grid>
       </Grid>
     </Paper>
   </Container>
 );

}

export default PayMedicineCreate;