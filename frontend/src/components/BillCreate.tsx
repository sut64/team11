import React,{useState,useEffect, ChangeEvent} from "react";
import {Link as RouterLink} from "react-router-dom"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Box, FormControl, Paper } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Title } from "@material-ui/icons";
import {MuiPickersUtilsProvider,KeyboardDatePicker,KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Select } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from '@mui/material/IconButton';

import { PatientInterface } from "../models/IPatient";
import { PatientRightInterface } from "../models/IPatientRight";
import { BillInterface } from "../models/IBill";
import { BillItemInterface } from "../models/IBillItem";
import { EmployeeInterface } from "../models/IEmployee";
import { PaytypeInterface } from "../models/IPaytype";
import { ExaminationInterface } from "../models/IExamination";



const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

const useStyles = makeStyles((theme: Theme) =>

    createStyles({

        root: { flexGrow: 1 },

        container: { marginTop: theme.spacing(2) },

        paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },

        table: { minWidth: 10 },
        tableSpace: {
            marginTop: 10,
          },
          title: {flexGrow: 1},

    })

);

function BillCreate(){
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const [getp, Setgetp] = useState<Partial<PatientInterface>>({ID:0});
    const [patients, setPatients] = useState<PatientInterface[]>([]);
    const [examinations, setExaminations] = useState<ExaminationInterface[]>([]);
    const [paytypes, setPaytypes] = useState<PaytypeInterface[]>([]);
    const [employees, setEmployees] = useState<Partial<EmployeeInterface>>({});
    const [cashier, setCashier] = useState<EmployeeInterface>();
    const [billitems,setBillitems] = useState<Partial<BillItemInterface>[]>([]);

    const [patientbill, setPatientbill] = useState<PatientInterface[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [bill, setBill] = useState<Partial<BillInterface>>(
        {PaytypeID:0,PatientRightID:0}
    );

    //check data status
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const apilUrl = "http://localhost:8080";
    const requesstMenuItems = {
        method : "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"},
    };
    
    const handleClose = (event?:React.SyntheticEvent, reason?:string) => {
        if (reason == "clickaway") {
            return ;
        }
        setSuccess(false);
        setError(false);

    };

    const handleInputChange = (
        event: React.ChangeEvent<{ id?: string; value: any }>
      ) => {
        const id = event.target.id as keyof typeof bill;
        const { value } = event.target;
        setBill({ ...bill, [id]: value });
      };
     

    const handleChange = (
        event: React.ChangeEvent<{ name?: string; value: unknown}>
    ) => {
        const name = event.target.name as keyof typeof bill;
        setBill({...bill,[name]: event.target.value,});
    };

    const handlePatientChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        const name = event.target.name as keyof typeof getp;
        Setgetp({...getp, [name]: event.target.value, });
    };

    // เพิ่ม examination ใส่ใน billitem
    const handleChangItem = (event: ChangeEvent<{name?: string, value: unknown}>) =>{
        let currentItem = [...billitems];
        console.log("before push lenght:",currentItem)
        if (Number(event.target.value)===0)
            return
        if (currentItem.length === 0){
            currentItem.push({
                ExaminationID : event.target.value as number
            })
            setBillitems(currentItem);
        }
        var error = true;
        if (currentItem.length !== 0){
            for(var index in currentItem){
                if(currentItem[index].ExaminationID === event.target.value){
                     error = false;
                     break;
                }
                else{
                     error = true;
                }
            }
            if (error){
                currentItem.push({
                    ExaminationID : event.target.value as number
                })
                setBillitems(currentItem);
            }
        }
        
        
        console.log("after push lenght:",currentItem)
    }

    const handleDateChange = (date : Date | null) =>{
        console.log(date);
        setSelectedDate(date);
    };

    //delete item from billitem
    const removeFromItem = (index: number) => {
        let updatedItem = billitems.filter((_, i) => i !== index);
        setBillitems(updatedItem);
      }



    const getPatient = async () =>{
        fetch(`${apilUrl}/patients`, requesstMenuItems)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setPatients(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };

    //get patient right when select patient
    const getBillpatient = async () =>{
        fetch(`${apilUrl}/patient/bill/`+getp.ID, requesstMenuItems)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setPatientbill(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };


    const getCashier = async () => {
        let uid = localStorage.getItem("uid");
        fetch(`${apilUrl}/employee/${uid}`, requesstMenuItems)
          .then((response) => response.json())
          .then((res) => {
            bill.EmployeeID = res.data.ID
            if (res.data) {
              console.log(res.data)
              setCashier(res.data);
            } else {
              console.log("else");
            }
          });
      };


    const getExaminationByID = async() => {
        const apiUrl = "http://localhost:8080/examination/patient/" + getp.ID;
        const requestMenuItems = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"},
        }

        fetch(apiUrl, requestMenuItems)
        .then((response) => response.json())
        .then((res) => {
                if(res.data) {
                    setExaminations(res.data)
                } else {
                    console.log("else")
                }
            });
    } 

    const getPaytype = async () =>{
        if (getp.ID !== 0 ){
            fetch(`${apilUrl}/paytypes`, requesstMenuItems)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setPaytypes(res.data);
                }
                else{
                    console.log("else");
                }
            });
        }
        else {
            setPaytypes([]);
        }
        
    };

    


    

    useEffect(() => {
        getPatient();
        getCashier();
       
    } , []);
    

    const convertType = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };


    function submit(){
        let data = {
            PatientRightID: convertType(bill.PatientRightID),
            PaytypeID: convertType(bill.PaytypeID),
            Total : typeof bill.Total === "string" ? parseInt(bill.Total) : 0,
            Telephone : bill.Telephone ?? "",
            BillTime: selectedDate,
            EmployeeID : convertType(bill.EmployeeID),
            BillItems : billitems,
            
        };
        console.log(data)

        const requesstMenuItemsPost = {
            method : "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"},
            body: JSON.stringify(data),
        };

        fetch(`${apilUrl}/bills`, requesstMenuItemsPost)
            .then((response) => response.json())
            .then((res) => {
                if(res.data) {
                    setSuccess(true);
                    setErrorMessage("");
                    clearForm();
                    
                }
                else{
                    setError(true);
                    if(res.error == "Total input not match !!"){
                        setErrorMessage("จำนวนค่าใช้จ่ายที่กรอก ไม่ตรงกันกับค่าใช้จ่ายทั้งหมด")
                    }
                    else if (res.error == "The data recorder should be a Cashier !!"){
                        setErrorMessage("ผู้บันทึกข้อมูลต้องเป็นเจ้าหน้าที่การเงินเท่านั้น")
                    }
                    else if (res.error == "Total cannot be zero"){
                        setErrorMessage("กรุณากรอกจำนวนค่าใช้จ่าย")
                    }
                    else if (res.error == "Telephone cannot be blank"){
                        setErrorMessage("กรุณากรอกเบอร์โทรศัพท์")
                    }
                    else if (res.error == "BillTime must be past"){
                        setErrorMessage("กรุณาเลือกวันและเวลาปัจจุบัน")
                    }
                    else {
                        setErrorMessage(res.error);
                    }
                    
                }
            });
    }

    const clearForm = () => {
        setBill({
            PatientRightID:0,
            PaytypeID:0,
            Total:0,
            Telephone:"",
            BillTime: new Date(),
        });
        setBillitems([]);
        setExaminations([]);
        Setgetp({ID:0});
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
                    บันทึกข้อมูลไม่สำเร็จ : {errorMessage}
                </Alert>
            </Snackbar>
            <Paper className={classes.paper}  >
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"

                            variant="h6"

                            color="primary"

                            className={classes.title}

                            gutterBottom
                        >
                            ใบแจ้งค่าใช้จ่าย
                        </Typography>
                        
                    </Box>
                </Box>
                <Divider />
                <Grid container spacing={1} className={classes.root}>
                    <Grid item xs={3}>
                        <Grid item xs={9} >
                            <FormControl fullWidth variant="outlined" size="small">
                            <p>คนไข้</p>
                            <Select
                            value={getp.ID}
                            onChange={handlePatientChange}
                            defaultValue = {0}
                            inputProps={{
                                name: "ID",
                            }}
                            >
                            <MenuItem value={0} key={0}>
                                เลือกคนไข้
                            </MenuItem>
                            {patients.map((item: PatientInterface) => (
                                <MenuItem value={item.ID} key={item.ID}>
                                    {item.FirstName} {item.LastName}
                                </MenuItem>
                            ))}
                            
                            </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={9}>
                            <FormControl fullWidth variant="outlined" size="small">    
                            <p>สิทธิ์การรักษา</p>
                            <Select
                            value={bill.PatientRightID}
                            onChange={handleChange}
                            onOpen={getBillpatient}
                            defaultValue = {0}
                            inputProps={{
                                name: "PatientRightID",
                            }}
                            >
                                <MenuItem value={0} key={0}>
                                เลือกสิทธิ์การรักษา
                                </MenuItem>
                                {patientbill.map((item: PatientInterface) => (
                                <MenuItem value={item.PatientRightID} key={item.ID}>
                                    {item.PatientRight.Name} 
                                </MenuItem>
                            ))}
                            </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={9}>
                            <FormControl fullWidth variant="outlined" size="small">     
                            <p>เจ้าหน้าที่การเงิน</p>
                            <Select
                            native
                            disabled
                            value={bill.EmployeeID}
                            onChange={handleChange}
                            inputProps={{
                                name: "EmployeeID",
                            }}
                             >
                                 <option value={cashier?.ID} key={cashier?.ID}>
                                    {cashier?.Name}
                                </option>
                         
                            </Select>
                            </FormControl>    

                            <p>ค่าใช้จ่ายทั้งหมด</p>
                                <FormControl fullWidth variant="outlined">
                                    <TextField
                                    id="Total"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    value={bill.Total|| ""}
                                    onChange={handleInputChange}
                                    />
                                </FormControl>

                        </Grid>

                    </Grid>
                    
                    <Grid item xs={3}>
                        <Grid item xs={9}>
                            <FormControl fullWidth variant="outlined" size="small">
                            <p>ใบผลการรักษา</p>
                            <Select 
                            onChange={handleChangItem}
                            onOpen={getExaminationByID}
                            defaultValue = {0}
                            inputProps={{
                                name: "ExaminationID",
                            }}
                            >
                            <MenuItem value={0} key={0}>
                                เลือกผลการรักษา
                            </MenuItem>
                            {examinations.map((item: ExaminationInterface) => (
                                <MenuItem value={item.ID} key={item.ID}>
                                    {item.Treatment} 
                                </MenuItem>
                            ))}
                            
                
                            </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={9}>
                            <FormControl fullWidth variant="outlined" size="small">
                            <p>ประเภทการชำระเงิน</p>
                            <Select 
                            value={bill.PaytypeID}
                            onChange={handleChange}
                            onOpen={getPaytype}
                            defaultValue = {0}
                            inputProps={{
                                name: "PaytypeID",
                            }}
                            >
                            <MenuItem value={0} key={0}>
                                เลือกประเภทการชำระ
                            </MenuItem>
                            {paytypes.map((item: PaytypeInterface) => (
                                <MenuItem value={item.ID} key={item.ID}>
                                    {item.Type}
                                </MenuItem>
                            ))}

                            </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={11}>
                        <p>วันและเวลา</p>
                        <form className={classes.container} noValidate>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                            name="BillTime"
                            value={bill.BillTime}
                             onChange={handleDateChange}
                             minDate={new Date("2018-01-01T00:00")}
                            format="yy/MM/dd hh:mm a"
                            />
                        </MuiPickersUtilsProvider>
                        </form>
                        </Grid>

                        <p>เบอร์โทรศัพท์</p>
                                <FormControl fullWidth variant="outlined">
                                    <TextField
                                    id="Telephone"
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    value={bill.Telephone|| ""}
                                    onChange={handleInputChange}
                                    />
                                </FormControl>

                    </Grid>
   
                    
                    <Grid item xs={6}>
                        <p>ผลการรักษาที่เลือก</p>
                        <TableContainer component={Paper} className={classes.tableSpace}>
                            <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" width="10%">ใบผลการรักษา</TableCell>
                                    <TableCell align="center" width="10%">ผลการรักษา</TableCell>
                                    <TableCell align="center" width="10%">ค่าใช้จ่ายทั้งหมด</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billitems.map((row:Partial<BillItemInterface>,index)=>{
                                    return (
                                        <TableRow key={index}>
                                            <TableCell align="center">{row.ExaminationID}</TableCell>
                                            <TableCell align="center">{examinations.find(p => p.ID === row.ExaminationID)?.Treatment}</TableCell>
                                            <TableCell align="center">{examinations.find(p => p.ID === row.ExaminationID)?.Cost}</TableCell>
                                            <TableCell width="5%"><IconButton size="small" onClick={() => removeFromItem(index)}><DeleteIcon /></IconButton></TableCell>

                                        </TableRow>
                                    )
                                })}
                               
                            </TableBody>
                            </Table>
                        </TableContainer>

                        <p>ผลการจ่ายยา</p>
                        <TableContainer component={Paper} className={classes.tableSpace}>
                            <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" width="10%">ใบผลการรักษา</TableCell>
                                    <TableCell align="center" width="10%">ชื่อยาที่จ่าย</TableCell>
                                    <TableCell align="center" width="10%">ค่าใช้จ่ายทั้งหมด</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {billitems.map((row:Partial<BillItemInterface>,index)=>{
                                    return (
                                        <TableRow key={index}>
                                            <TableCell align="center">{row.ExaminationID}</TableCell>
                                            <TableCell align="center">{examinations.find(p => p.ID === row.ExaminationID)?.Medicine.Name}</TableCell>
                                            <TableCell align="center">{examinations.find(p => p.ID === row.ExaminationID)?.Medicine.Cost}</TableCell>
                                            

                                        </TableRow>
                                    )
                                })}
                               
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid item xs={6}>
                            <Button style={{ float: "left" }}
                                variant="contained"
                                onClick={submit}
                                color="primary">
                                บันทึก
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid item xs={2}>
                        <Grid item xs={4}>
                            
                        </Grid>  
                    </Grid>

                    <Grid item xs={2}>
                        <Grid item xs={4}>
                           
                        </Grid>  
                    </Grid>
                    <Grid item xs={1}> 
                    </Grid>

                    <Grid item xs={1}>
                        <Grid item xs={6}>
                            <Button style={{ float: "left" }}
                                variant="contained"
                                component={RouterLink}
                                to="/ListBills"
                                color="primary">
                                กลับ
                            </Button>
                        </Grid>  
                        
                    </Grid>
                    

                </Grid>

               
            </Paper>
        </Container>
    );
}

export default BillCreate;