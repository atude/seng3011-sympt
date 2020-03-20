import React, { useState, useEffect } from 'react';
import {
  Button, Grid, makeStyles, Theme, Paper, Typography, 
} from '@material-ui/core';
import { 
  AccountCircle, 
  Dashboard as DashboardIcon,
  Mail as MailIcon,
  VpnKey as KeyIcon,
} from '@material-ui/icons';

import { signOut, refreshToken } from '../firebase/firebaseFunctions';
import firebase from '../firebase/firebaseInit';

const useStyles = makeStyles((theme: Theme) => ({
  parent: {
    width: "100%",
    margin: "auto",
    maxWidth: "800px",
  },
  paperParent: {
    padding: "2rem",
  },
  accountIcon: {
    fontSize: "6rem",
  },
  dashboardIcon: {
    padding: "10px",
    marginTop: "7px",
  },
  inlineIcon: {
    marginBottom: "-6px",
    marginRight: "8px",
  },
  longText: {
    wordBreak: "break-all",
  },
  showButton: {
    margin: "8px 0 8px 0",
    paddingTop: "2px",
    paddingBottom: "2px",
  },
}));

const Dashboard = (props: any) => {
  const { user } = props;
  const classes = useStyles();

  const [token, setToken] = useState("-----");
  const [showToken, setShowToken] = useState(false);

  const getToken = async () => {
    const res = firebase.auth().currentUser?.getIdToken();
    return res;
  };

  useEffect(() => {
    getToken().then((res) => setToken(res ?? "Error fetching token."));
  }, []);

  const handleRefreshToken = async () => {
    const newToken = await refreshToken();
    setToken(newToken ?? "Error refreshing token.");
  };

  return (
    <div className={classes.parent}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <DashboardIcon className={classes.dashboardIcon} fontSize="large" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h4">
            Dashboard
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Paper className={classes.paperParent} elevation={4}>
        <Grid container direction="row" spacing={8}>
          <Grid item>
            <Grid item container direction="column" spacing={1} justify="center" alignItems="center">
              <Grid item>
                <AccountCircle className={classes.accountIcon} color="secondary" />
              </Grid>
              <Grid item>
                <Button color="primary" variant="contained" onClick={() => handleRefreshToken()}>
                  Refresh Token
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary" variant="contained" onClick={() => signOut()}>
                  Sign out
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="button" color="primary"> 
              <MailIcon className={classes.inlineIcon} color="primary" />
              Account Email
            </Typography>
            <Typography color="secondary">{user.email}</Typography>
            <br />
            <Typography variant="button" color="primary">
              <KeyIcon className={classes.inlineIcon} color="primary" />
              API Token
            </Typography>
            <br />
            <Button 
              className={classes.showButton}
              color="secondary" 
              variant="outlined" 
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? "Hide" : "Show"}
            </Button>
            {showToken && (
              <Typography className={classes.longText} color="secondary">
                {token}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Dashboard;
