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
import { BillItemInterface } from "../models/IBillItem";
import { BillInterface } from "../models/IBill";

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
  useEffect(() => {
    getBillitems();
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
            startIcon={<PersonAddIcon />}
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
                ใบผลการรักษา
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
          {bills.map((item: Partial<BillInterface>) => (
                                    <TableRow key={item.ID}>
                                        <TableCell align="center">{item.ID}</TableCell>
                                        <TableCell align="center">{item.Employee?.Name}</TableCell>
                                        <TableCell align="center">{item.Total}</TableCell>
                                        <TableCell align="center">{billitems.find(p=>p.ID === item.ID)?.ExaminationID}</TableCell>
                                        
                                       
                                    </TableRow>

                                ))}

          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
export default ListBill;