import { useEffect, useState,Fragment } from "react";
import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { BillItemInterface } from "../models/IBillItem";
import { BillInterface } from "../models/IBill";
import { ExaminationInterface } from "../models/IExamination";
import { PayMedicineInterface } from "../models/IPayMedicine";


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


export interface ListBillProps {
  item : BillInterface,

}

function ListBillItem(row: ListBillProps){
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  
  return (
                                
                           
                                
                                <Fragment>
                                  
                                  <TableRow>
                                  <TableCell align="center" scope="row"> {row.item.ID}</TableCell>
                                  <TableCell align="center" scope="row"> {row.item.Employee.Name}</TableCell>
                                  <TableCell align="center" scope="row"> {row.item.Total}</TableCell>
                                  <TableCell align="center" scope="row"> {row.item.PatientRight.Name}</TableCell>
                             
                                    <TableCell align="center" >
                                    <IconButton
                                              aria-label="expand row"
                                              size="small"
                                              onClick={() => setOpen(!open)}
                                            >
                                              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                    </TableCell>
                                  </TableRow>

                                  <TableRow>
                                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6} >
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                      <Box sx={{ margin: 1 }}>
                                        <Typography variant="h6" gutterBottom component="div">
                                          ผลการรักษา
                                        </Typography>
                                        <Table size="small" aria-label="purchases">
                                          <TableHead>
                                            <TableRow>
                                              <TableCell align="center">ใบผลการรักษา</TableCell>
                                              <TableCell align="center">ผลการรักษา</TableCell>
                                              <TableCell align="center">ค่าใช้จ่าย</TableCell>
                                              <TableCell align="center">ยาที่จ่าย</TableCell>
                                              <TableCell align="center">ค่าใช้จ่าย</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                          {row.item.BillItems?.map((row:Partial<BillItemInterface>,index)=>{
                                                  return (
                                                      <TableRow key={index}>
                                                          <TableCell align="center">{row.ExaminationID}</TableCell>
                                                          <TableCell align="center">{row.Examination?.Treatment}</TableCell>
                                                          <TableCell align="center">{row.Examination?.Cost}</TableCell>
                                                          <TableCell align="center">{row.Examination?.Medicine.Name}</TableCell>
                                                          <TableCell align="center">{row.Examination?.Medicine.Cost}</TableCell>
                                                         
                                                      </TableRow>
                                                  )
                                              })}
                                               
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                             
                                </Fragment>
                               
  )
}



function ListBill() {
  const classes = useStyles();
  const [bills,setBills] = useState<BillInterface[]>([]);
 
  

  const getBills = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/bills`, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBills(res.data);
        } else {
          console.log("else");
        }
      });
  };

  
  useEffect(() => {
    getBills();
  }, []);

  return (
    <div>
      <Box display="flex">
        <Box flexGrow={1}>
          <Typography component="h2" variant="h4" color="primary">
            ประวัติใบแจ้งค่าใช้จ่าย
          </Typography>
        </Box>
        <Box>
          <Button
            component={RouterLink}
            to="/CreateBill"
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
          >
            สร้างใบแจ้งค่าใช้จ่าย
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
        <Table className={classes.table} aria-label="collapsible table">
          <TableHead>
            <TableRow >
              <TableCell  className={classes.title} align="center" >
                เลขที่ใบแจ้งค่าใช้จ่าย
              </TableCell>
              <TableCell  className={classes.title} align="center" >
                ผู้ทำการบันทึก
              </TableCell>
              <TableCell  className={classes.title} align="center" >
                ค่าใช้จ่ายทั้งหมด
              </TableCell>
              <TableCell  className={classes.title} align="center" >
                สิทธิ์การรักษา
              </TableCell>
              <TableCell  className={classes.title} align="center" >
                ผลการรักษา
              </TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
          {bills.map((item: BillInterface) => (
                                    
                                        <ListBillItem key={item.ID} item={item}/>
                                     
                                ))}
          
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
export default ListBill;