import React from react;
import { Link as RouterLink } from react-router-dom;
import { makeStyles, Theme, createStyles } from @material-uicorestyles;
import { useEffect, useState } from react;
import TextField from @material-uicoreTextField;
import Button from @material-uicoreButton;
import FormControl from @material-uicoreFormControl;
import Container from @material-uicoreContainer;
import Paper from @material-uicorePaper;
import Grid from @material-uicoreGrid;
import Box from @material-uicoreBox;
import Typography from @material-uicoreTypography;
import Divider from @material-uicoreDivider;
import Snackbar from @material-uicoreSnackbar;
import MuiAlert, { AlertProps } from @material-uilabAlert;
import {MuiPickersUtilsProvider,KeyboardDatePicker,} from @material-uipickers;
import DateFnsUtils from @date-iodate-fns;
import { MenuItem, Select } from @material-uicore;
import { PatientInterface } from ..modelsIPatient;
import { MedicineInterface } from ..modelsIMedicine;
import { EmployeeInterface } from "../models/IEmployee";
import { PayMedicineInterface } from ..modelsIPayMedicine;



function Alert(props AlertProps) {

 return MuiAlert elevation={6} variant=filled {...props} ;

}

const useStyles = makeStyles((theme Theme) =

 createStyles({

   root {flexGrow 1},
   container {marginTop theme.spacing(2)},
   paper {padding theme.spacing(2),color theme.palette.text.secondary},
 })
);

function CreatePayMedicine() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useStateDate  null(new Date());
  const [employee, setemployee] = useStateEmployeeInterface();

  const [getp, Setgetp] = useStatePartialPatientInterface({});
  const [patient, setPatient] = useStatePatientInterface[]([]);

  const [getm, Setgetm] = useStatePartialMedicineInterface({});
  const [Medicine, setMedicine] = useStateMedicineInterface[]([]);

  const [paymedicine, setPayMedicine] = useStatePartialPayMedicineInterface({});

 const [success, setSuccess] = React.useState(false);
 const [error, setError] = React.useState(false);
 
 const handleClose = (event React.SyntheticEvent, reason string) = {
   if (reason === clickaway) {
     return;
   }
   setSuccess(false);

   setError(false);
 };

 const apilUrl = httplocalhost8080;
    const requestOptions = {
        method  GET,
        headers {
            Authorization `Bearer ${localStorage.getItem(token)}`,
            Content-Type applicationjson},
    };

 const handleDateChange = (date Date  null) = {
   setSelectedDate(date);
 };

const handleChange = (
  event React.ChangeEvent{ name string; value unknown}
) = {
  const name = event.target.name as keyof typeof paymedicine;
  setPayMedicine({... paymedicine,[name] event.target.value,});
};

 const handleInputChange = (
   event React.ChangeEvent{ id string; value any }
 ) = {
   const id = event.target.id as keyof typeof CreatePayMedicine;
   const { value } = event.target;
   setPayMedicine({ ...paymedicine, [id] value });

 };

 const getPatient = async () ={
  fetch(`${apilUrl}patients`, requestOptions)
      .then((response) = response.json())
      .then((res) = {
          if (res.data){
              setPatient(res.data);
          }
          else{
              console.log(else);
          }
      });
};

  const getMedicine = async () ={
        fetch(`${apilUrl}medicine`, requestOptions)
            .then((response) = response.json())
            .then((res) = {
                if (res.data){
                    setMedicine(res.data);
                }
                else{
                    console.log(else);
                }
            });
};

 const getEmployee = async () ={
  let uid = localStorage.getItem(uid);
  console.log(uid);
  fetch(`${apilUrl}employees${uid}`, requestOptions)
      .then((response) = response.json())
      .then((res) = {
          employee.EmployeeID = res.data.ID
          if (res.data){
              setemployee(res.data);
          }
          else{
              console.log(else);
          }
      });
};

  useEffect(() = {
   getPatient();
   getMedicine();
   getEmployee();
  },[]);

 const convertType = (data string  number  undefined) = {
  let val = typeof data === string  parseInt(data)  data;
  return val;
};
 function submit() {
   let data = {
     EmployeeID  convertType(employee.EmployeeID),
     PatientID  convertType(paymedicine.PatientID),
     MedicineID  convertType(paymedicine.MedicineID),
     Cost convertType(paymedicine.Cost),
     PayMedicineTime selectedDate,

   };

   console.log(data)
   const requestOptionsPost = {

     method POST,

     headers { Authorization `Bearer ${localStorage.getItem(token)}`,
     Content-Type applicationjson },
     body JSON.stringify(data),

   };

  fetch(`${apilUrl}paymedicines`, requestOptionsPost)
       .then((response) = response.json())
       .then((res) = {
         if (res.data) {
           console.log(บันทึกได้)
           setSuccess(true);
         } else {
           console.log(บันทึกไม่ได้)
           setError(true);
         }
       });
   }

 return (
   Container className={classes.container} maxWidth=md
     Snackbar open={success} autoHideDuration={6000} onClose={handleClose}
       Alert onClose={handleClose} severity=success
         บันทึกข้อมูลสำเร็จ
       Alert
     Snackbar
     Snackbar open={error} autoHideDuration={6000} onClose={handleClose}
       Alert onClose={handleClose} severity=error
         บันทึกข้อมูลไม่สำเร็จ
       Alert
     Snackbar
     Paper className={classes.paper}
       Box display=flex
         Box flexGrow={1}
           Typography
             component=h2
             variant=h6
             color=primary
             gutterBottom
           
             บันทึกการจ่ายยา
           Typography
         Box
       Box
       Divider
      Grid container spacing = {3} className={classes.root}
        Grid item xs={6}
        pคนไข้p
        FormControl fullWidth variant=outlined size=medium
        Select
          value={paymedicine.PatientID}
          defaultValue = {0}
          onChange={handleChange}
          inputProps={{name PatientID}}
         
        MenuItem value={0} key={0}
           กรุณาเลือกคนไข้
            MenuItem
            {patient.map((item PatientInterface) = (
            MenuItem value={item.ID} key={item.ID}
           {item.FirstName} {item.LastName}
           MenuItem
        ))}
      Select
      FormControl
      Grid  
           Grid item xs={12}
          FormControl fullWidth variant=outlined size = small
           p ใบเสร็จ p
           Select
              id=ReceiptID
              value={paymedicine.ReceiptID}
              defaultValue = {0}
              onChange={handleChange}
              inputProps={{name ReceiptID}}
          
            MenuItem value={0} key={0}
              เลือกใบเสร็จ
              MenuItem
              {receipt.map((item ReceiptInterface) = (
              MenuItem value={item.ID} key={item.ID}
              {item.BillID}
              MenuItem
              ))}
            Select
            FormControl
            Grid
            Grid item xs={12}
            FormControl fullWidth variant=outlined size = small
            p ยาที่ได้รับ p
            Select
              id=MedicineID
              value={paymedicine.MedicineID}
              defaultValue = {0}
              onChange={handleChange}
              inputProps={{name MedicineID}}
            
            MenuItem value={0} key={0}
            เลือกยา
            MenuItem
              {Medicine.map((item MedicineInterface) = (
              MenuItem value={item.ID} key={item.ID}
                {item.MedicineName}
              MenuItem
              ))}
            Select
            FormControl
            Grid
            Grid item xs={6}
            FormControl fullWidth variant=outlined
            pจำนวนยาp
            TextField
              id=Medicine_Amount
              variant=outlined
              type=number
              size=medium
              value={paymedicine.Medicine_Amount}
              onChange={handleInputChange}
          
          FormControl
          Grid
          Grid item xs={6}
          pเภสัชกรp
          FormControl fullWidth variant=outlined size=medium
          Select
              native
              disabled
              id=PharmacistID
              value={paymedicine.ID}
              defaultValue = {0}
              onChange={handleChange}
              inputProps={{name PharmacistID}}
             
              option value={pharmacist.ID} key={pharmacist.ID}{pharmacist.Name}
              option

              Select
              FormControl
              Grid
              Grid item xs={6}
           FormControl fullWidth variant=outlined
             pวันที่จ่ายยาp
             MuiPickersUtilsProvider utils={DateFnsUtils}
               KeyboardDatePicker
                 margin=normal
                 id=Pay_DateTime
                 format=yyyy-MM-dd
                 value={selectedDate}
                 onChange={handleDateChange}
                 KeyboardButtonProps={{
                   aria-label change date,
                 }}
               
             MuiPickersUtilsProvider
           FormControl
         Grid
         Grid item xs={12}
           Button component={RouterLink} to=paymedicine variant=contained
             กลับ
           Button
           Button
             style={{ float right }}
             onClick={submit}
             variant=contained
             color=primary
           
             บันทึกข้อมูลการจ่ายยา
           Button
         Grid
       Grid
     Paper
   Container
 );

}

export default CreatePayMedicine;