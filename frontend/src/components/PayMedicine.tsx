import { useEffect , useState } from "react";
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
import { PayMedicineInterface } from "../models/IPayMedicine";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
 createStyles({
   container: {marginTop: theme.spacing(2)},
   table: { minWidth: 650},
   tableSpace: {marginTop: 20},
 })

);
function PayMedicine() {

 const classes = useStyles();
 const [paymedicine, setPayMedicine] = useState<PayMedicineInterface[]>([]);
 const apiUrl = "http://localhost:8080";
 const requestOptions = {
   method: "GET",
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
     "Content-Type": "application/json",
   },
 };

 const getPayMedicine = async () => {
   fetch(`${apiUrl}/paymedicines`, requestOptions)
     .then((response) => response.json())
     .then((res) => {
       console.log(res.data);
       if (res.data) {
         setPayMedicine(res.data);
       } else {
         console.log("else");
       }
     });
 };

 useEffect(() => {
   getPayMedicine();
 }, []);

 return (
   <div>
     <Container className={classes.container} maxWidth="md">
       <Box display="flex">
         <Box flexGrow={1}>
           <Typography
             component="h2"
             variant="h6"
             color="primary"
             gutterBottom
           >
             ข้อมูลการจ่ายยา
           </Typography>
         </Box>
         <Box>
           <Button
             component={RouterLink}
             to="/PayMedicineCreate"
             variant="contained"
             color="primary"
           >
             กรอกข้อมูลการจ่ายยา

           </Button>
         </Box>
       </Box>
       <TableContainer component={Paper} className={classes.tableSpace}>
         <Table className={classes.table} aria-label="simple table">
           <TableHead>
             <TableRow>
               <TableCell align="center" width="5%">
                 ลำดับ
               </TableCell>
               <TableCell align="center" width="20%">
                 ชื่อ-นามสกุลของผู้ป่วย
               </TableCell>
               <TableCell align="center" width="20%">
                ยาที่จ่าย
               </TableCell>
               <TableCell align="center" width="10%">
                ค่ายา
               </TableCell>
               <TableCell align="center" width="20%">
                 วันที่จ่ายยา
               </TableCell>
               <TableCell align="center" width="20%">
                 เภสัชกร
               </TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {paymedicine.map((item: PayMedicineInterface) => (
               <TableRow key={item.ID}>
                 <TableCell align="center">{item.ID}</TableCell>
                 <TableCell align="center">{item.Patient.FirstName}</TableCell>
                 <TableCell align="center">{item.Medicine.Name}</TableCell>
                 <TableCell align="center">{item.Medicine.Cost}</TableCell>
                 <TableCell align="center">
                    {moment(item.PayMedicineTime).format("DD/MM/YYYY")}</TableCell>
                 <TableCell align="center">{item.Employee.Name}</TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
     </Container>
   </div>
 );
}
 
export default PayMedicine;