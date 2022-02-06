import { useEffect, useState } from "react";
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

import { MedicineInterface } from "../models/IMedicine";


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

function ListBill() {
  const classes = useStyles();
  const [billitems,setBillitems] = useState<BillItemInterface[]>([]);
  const [bills,setBills] = useState<BillInterface[]>([]);
  const [exams,setexams] = useState<ExaminationInterface[]>([]);
  const [medi,setMedi] = useState<MedicineInterface[]>([]);
  const [open, setOpen] = React.useState(false);

  const getBillitems = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/billitems`, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBillitems(res.data);
        } else {
          console.log("else");
        }
      });
  };

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

  const getExaminations = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/examinations`, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setexams(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getMedicines = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/medicines`, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setMedi(res.data);
        } else {
          console.log("else");
        }
      });
  };



  useEffect(() => {
    getBillitems();
    getBills();
    getExaminations();
    getMedicines();
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
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow >
              <TableCell align="center" className={classes.title}>
                เลขที่ใบแจ้งค่าใช้จ่าย
              </TableCell>
              <TableCell align="center" className={classes.title}>
                ผู้ทำการบันทึก
              </TableCell>
              <TableCell align="center" className={classes.title}>
                ค่าใช้จ่ายทั้งหมด
              </TableCell>
              <TableCell align="center" className={classes.title}>
                สิทธิ์การรักษา
              </TableCell>
              <TableCell align="center" className={classes.title}>
                ผลการรักษา
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
          {bills.map((item: Partial<BillInterface>) => (
                                    <TableRow key={item.ID}>
                                        <TableCell align="center">{item.ID}</TableCell>
                                        <TableCell align="center">{item.Employee?.Name}</TableCell>
                                        <TableCell align="center">{item.Total}</TableCell>
                                        <TableCell align="center">{item.PatientRight?.Name}</TableCell>
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
                                ))}
                                <TableRow>
                                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                                            {billitems.map((item) => (
                                              <TableRow key={item.ID}>
                                                <TableCell component="th" scope="row" align="center">
                                                  {item.ExaminationID}
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                  {exams.find(p=>p.ID === item.ExaminationID)?.Treatment}
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                  {exams.find(p=>p.ID === item.ExaminationID)?.Cost}
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                  {exams.find(p=>p.ID === item.ExaminationID)?.Medicine?.Name}
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                  {exams.find(p=>p.ID === item.ExaminationID)?.Medicine?.Cost}
                                                </TableCell>
                                               
                                             

                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
export default ListBill;