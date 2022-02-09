import { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { PatientInterface } from "../models/IPatient";
import { TotalPatient } from "./dashboard/totalPatient";
import { TotalPatientMale } from "./dashboard/totalPatientMale";
import { TotalPatientFemale } from "./dashboard/totalPatientFemale";
import { listPatients } from "./dashboard/listPatients";
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
    tableHead: {
      fontFamily:"Prompt",
      fontWeight:"bold",
    },
  })
);

function Home() {
  const classes = useStyles();
  const [patients, setPatients] = useState<PatientInterface[]>([]);
  const getPatients = async () => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        if (res.data) {
          console.table(res.data);
          setPatients(res.data);
        } else {
          console.log("else");
        }
      });
  };

  var total = patients.length;
  var totalMale = 0;
  var totalFemale = 0;

  for (let i of patients) {
    if (i.GenderID == 1) totalMale += 1;
    if (i.GenderID == 2) totalFemale += 1;
  }
  console.log("Male", totalMale);
  console.log("Female", totalFemale);

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div style={{marginTop:30}}>
      <Grid item xs={12}>
        {TotalPatient(total)}
      </Grid>
      <Grid container spacing={3} style={{marginTop:10}}>
        <Grid item xs={6}>
          {TotalPatientMale(totalMale)}
        </Grid>
        <Grid item xs={6}>
          {TotalPatientFemale(totalFemale)}
        </Grid>
      </Grid>
      <Grid item xs={12} style={{marginTop:20}}>
      {listPatients(patients)}
      </Grid>
    </div>
  );
}
export default Home;
