import React, { useEffect } from "react";
import clsx from "clsx";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';
import HomeIcon from "@material-ui/icons/Home";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import NoteIcon from '@mui/icons-material/Note';

import Home from "./components/Home";
import SignIn from "./components/SignIn";
import CreatePatient from "./components/CreatePatient"
import { EmployeeInterface } from "./models/IEmployee";
import { RoleInterface } from "./models/IRole";
import CreateAppointment from "./components/CreateAppointment"
import Appointments from "./components/Appointment"
import CreateClinicLog from "./components/CreateClinicLog"
import AllInboxIcon from '@material-ui/icons/AllInbox';
import BillCreate from "./components/BillCreate";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ListPatient from "./components/listPatient"; 

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    title: {
      flexGrow: 1,
      fontFamily: "Monospace",
      fontSize: "1.5rem",
      color: "#fff",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    a: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);
const theme = createTheme({
  palette: {
    primary: {
      main: '#009688',
    },
    secondary: {
      main: '#ffc400',
    },
  },
});

export default function MiniDrawer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<String>("");
  const [employee, setEmploree] = React.useState<EmployeeInterface>();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //Get Data
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
  };
  const getEmployee = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/employee/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log("employee",res.data);
        if (res.data) {
          setEmploree(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const menu = [
    { name: "หน้าแรก", icon: <HomeIcon style={{ color: '#009688', fontSize: 30 }} />, path: "/" },
    { name: "บันทึกการรับเข้าผู้ป่วย", icon: <PersonAddIcon />, path: "/CreatePatient" },
    { name: "บันทึกรายการนัดหมาย", icon: <AllInboxIcon />, path: "/Appointment" },
    { name: "บันทึกการส่งตรวจคลินิก", icon: <NoteIcon />, path: "/CreateClinicLog" },
    { name: "ใบแจ้งค่าใช้จ่าย", icon: <AccountBalanceIcon />, path: "/CreateBill" },

  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    getEmployee();
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <SignIn />;
  }

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <BrowserRouter>
          <CssBaseline />
          {token && (
            <>
              <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: open,
                })}
              >
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {
                      [classes.hide]: open,
                    })}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    523332 Software Engineering
                  </Typography>
                  <Chip
                    size="medium"
                    icon={<FaceIcon style={{ color: '#009688' }} />}
                    label={employee?.Name + " ( " + employee?.Role.Position + " )"}
                    variant="outlined"
                    style={{ backgroundColor: '#fff', fontSize: '1rem', color: '#009688' }}
                  />
                  <Button color="inherit" onClick={signout} style={{ fontFamily: "Kanit" }}>
                    <ExitToAppIcon style={{ fontSize: 30, marginRight: 2 }} />
                  </Button>
                </Toolbar>
              </AppBar>
              <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                })}
                classes={{
                  paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                  }),
                }}
              >
                <div className={classes.toolbar}>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                      <ChevronRightIcon />
                    ) : (
                      <ChevronLeftIcon />
                    )}
                  </IconButton>
                </div>
                <Divider />
                <List>
                  <>
                    {
                      menu.map((item, index) => (
                        <Link to={item.path} key={item.name} className={classes.a}>
                          <ListItem button>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                          </ListItem>
                        </Link>
                      ))
                    }
                  </>
                </List>
              </Drawer>
            </>
          )}

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/CreatePatient" element={<CreatePatient />} />
                <Route path="/CreateAppointment" element={<CreateAppointment />} />
                <Route path="/Appointment" element={<Appointments />} />
                <Route path="/CreateClinicLog" element={<CreateClinicLog />} />
                <Route path="/CreateBill" element={<BillCreate />} />
                <Route path="/listPatient" element={<ListPatient/>} />
              </Routes>
            </div>
          </main>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}