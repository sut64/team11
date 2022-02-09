import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';

export const TotalPatientMale = (props:number) => (
  <Card {...props}>
    <CardContent sx={{backgroundColor:"#AED6F1"}}>
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
            จำนวนผู้ป่วยชาย
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
              backgroundColor: "#6495ED",
              height: 56,
              width: 56,
              mt:2
            }}
          >
            <MaleRoundedIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);