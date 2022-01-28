import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ExaminationInterface } from "../models/IExamination"
import { format } from 'date-fns'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from "@material-ui/icons/Home";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },

  })
);

function Examination() {
  const classes = useStyles();
  const [Examinations, setExaminations] = useState<ExaminationInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getExaminations = async () => {
    fetch(`${apiUrl}/examinations`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setExaminations(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getExaminations();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="xl">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h5"
              color="primary"
              gutterBottom
            >
              ระบบบันทึกผลวินิจฉัย
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/CreateExamination"
              variant="contained"
              startIcon={<AddCircleIcon/>}
              color="primary"
            >
              บันทึกข้อมูลผลการวินิจฉัย
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
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography
                                component="h2"
                                variant="h6"
                                color="primary"
                                gutterBottom
                            >
                                ประวัติผลวินิจฉัย
                            </Typography>
                        </Box>
                    </Box>
                    
              <TableContainer component={Paper} className={classes.tableSpace}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center" width="7%">
                        หมายเลขประจำตัวผู้ป่วย
                        </TableCell>
                        <TableCell align="center" width="13%">
                        ชื่อ-นามสกุลผู้ป่วย
                        </TableCell>
                        <TableCell align="center" width="15%">
                        แพทย์ผู้วินิจฉัย
                        </TableCell>
                        <TableCell align="center" width="7%">
                        คลินิก
                        </TableCell>
                        <TableCell align="center" width="10%">
                        อาการสำคัญ
                        </TableCell>
                        <TableCell align="center" width="10%">
                        โรคจากการวินิจฉัย
                        </TableCell>
                        <TableCell align="center" width="10%">
                        วิธีการรักษา
                        </TableCell>
                        <TableCell align="center" width="7%">
                        ราคาการรักษา
                        </TableCell>
                        <TableCell align="center" width="10%">
                        ยาที่ต้องจ่าย
                        </TableCell>
                        <TableCell align="center" width="15%">
                        วันเวลาที่ทำการวินิจฉัย
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {Examinations.map((item: ExaminationInterface) => (
                        <TableRow key={item.ID}>
                        <TableCell align="center">{item.Patient.HN}</TableCell>
                        <TableCell align="center">{[item.Patient.FirstName, " ", item.Patient.LastName]}</TableCell>
                        <TableCell align="center">{item.Employee.Name}</TableCell>
                        <TableCell align="center">{item.Clinic.ClinicName}</TableCell>
                        <TableCell align="center">{item.ChiefComplaint}</TableCell>
                        <TableCell align="center">{item.Disease.Name}</TableCell>
                        <TableCell align="center">{item.Treatment}</TableCell>
                        <TableCell align="center">{item.Cost}</TableCell>
                        <TableCell align="center">{item.Medicine.Name}</TableCell>
                        <TableCell align="center">{format((new Date(item.DiagnosisTime)), "yyyy/MM/dd hh:mm a")}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
      </Container>
    </div>
  );
}

export default Examination;