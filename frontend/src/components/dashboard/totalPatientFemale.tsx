import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';

export const TotalPatientFemale = (props:number) => (
  <Card {...props}>
    <CardContent sx={{backgroundColor:"#F1BDEE"}}>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="#000"
            gutterBottom
            variant="overline"
            fontWeight="bold"
            fontSize={15}
            fontFamily="Prompt"
          >
            จำนวนผู้ป่วยหญิง
          </Typography>
          <Typography
            color="#000"
            variant="h4"
            fontWeight="bold"
          >
            {props}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: '#DE3163',
              height: 56,
              width: 56,
              mt:2
            }}
          >
            <FemaleRoundedIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);