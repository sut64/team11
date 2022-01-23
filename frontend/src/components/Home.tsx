import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import g11 from "../images/g11.jpg";

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
  })
);

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <p style={{fontSize: 40, textAlign: "center", color: "#009688" }}>ระบบจัดการคนไข้ใน</p>
        <img src={g11} style={{width: "100%", height: "auto"}} />
      </Container>
    </div>
  );
}
export default Home;