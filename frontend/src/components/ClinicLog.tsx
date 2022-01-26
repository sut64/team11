import React, { useEffect, useState } from "react";
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
import { ClinicLogInterface } from "../models/IClinicLog";
import SignIn from "./SignIn";
import moment from "moment";

import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';
import AllInboxIcon from '@material-ui/icons/AllInbox';


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




function ClinicLogs() {
    const [token, setToken] = React.useState<String>("");
    const classes = useStyles();
    const [cliniclogs, setClinicLogs] = React.useState<ClinicLogInterface[]>([]);



    const getClinicLogs = async () => {
        const apiUrl = "http://localhost:8080/cliniclogs";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setClinicLogs(res.data);
                } else {
                    console.log("else");
                }
            });
    };

    useEffect(() => {
        getClinicLogs();
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        }
    }, []);

    if (!token) {
        return <SignIn />;
    }


    return (

        <div>

            <Container className={classes.container} maxWidth="md">
                <Box display="flex">
                    <Box flexGrow={1}>
                    <Chip
                    size="medium"
                    icon={<AllInboxIcon style={{ color: '#009688' }} />}
                    label={"ระบบบันทึกการส่งตรวจคลินิก"}
                    variant="outlined"
                    style={{ backgroundColor: '#fff', fontSize: '1rem', color: '#009688' }}
                    />
                    </Box>
                    <Box>
                        <Button
                            component={RouterLink}
                            to="/CreateClinicLog"
                            variant="contained"
                            color="primary"
                        >
                            บันทึกการส่งตรวจคลินิก
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
                                รายการส่งตรวจ
                            </Typography>
                        </Box>
                    </Box>
                    <TableContainer component={Paper} className={classes.tableSpace} >
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" width="20%" >
                                        ผู้ป่วย
                                    </TableCell>
                                    <TableCell align="center" width="15%">
                                        คลินิก
                                    </TableCell>
                                    <TableCell align="center" width="5%">
                                        หมายเลขห้อง
                                    </TableCell>
                                    <TableCell align="center" width="10%">
                                        วันที่/เวลา
                                    </TableCell>
                                    <TableCell align="center" width="25%">
                                        หมายเหตุ
                                    </TableCell>
                                    <TableCell align="center" width="20%">
                                        ผู้บันทึก
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cliniclogs.map((item: ClinicLogInterface) => (
                                    <TableRow key={item.ID}>
                                        <TableCell align="center">{item.Patient.FirstName}{"  "}{item.Patient.LastName}</TableCell>
                                        <TableCell align="center">{item.Clinic.ClinicName}</TableCell>
                                        <TableCell align="center">{item.ClinicRoom}</TableCell>
                                        <TableCell align="center">{moment(item.SendingTime).format('D MMMM YYYY,HH:mm:ss')}</TableCell>
                                        <TableCell align="center">{item.Note}</TableCell>
                                        <TableCell align="center">{item.Employee.Name}</TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Container>

        </div >
    );
}
export default ClinicLogs;