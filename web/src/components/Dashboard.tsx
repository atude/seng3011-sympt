import React, { useState, useEffect } from 'react';
import {
  Button, 
  Grid, 
  makeStyles, 
  Theme, 
  Paper, 
  Typography, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  LinearProgress, 
} from '@material-ui/core';
import { 
  AccountCircle, 
  Dashboard as DashboardIcon,
  Mail as MailIcon,
  VpnKey as KeyIcon,
  ListAlt,
} from '@material-ui/icons';

import { signOut, refreshToken, fetchLogs } from '../firebase/firebaseFunctions';
import firebase from '../firebase/firebaseInit';
import { ApiLog } from '../types';

const moment = require('moment');

const useStyles = makeStyles((theme: Theme) => ({
  parent: {
    width: "100%",
    margin: "auto",
    maxWidth: "800px",
  },
  paperParent: {
    padding: "2rem",
  },
  tableContainer: {
    padding: "1.6rem",
    maxHeight: "600px",
    overflow: "auto",
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

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("-----");
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      const getToken = await firebase.auth().currentUser?.getIdToken();
      setToken(getToken ?? "Error fetching token.");

      const getLogs = await fetchLogs(user.email);
      setLogs(getLogs);
      setLoading(false);
    };

    initFetch();
  }, [user.email]);

  const handleRefreshToken = async () => {
    const newToken = await refreshToken();
    setToken(newToken ?? "Error refreshing token.");
  };

  if (loading) {
    return (
      <div className={classes.parent}>
        <LinearProgress />
      </div>
    );
  }

  return (
    <div className={classes.parent}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <DashboardIcon className={classes.dashboardIcon} fontSize="large" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h5">
            Dashboard
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Paper className={classes.paperParent} elevation={4}>
        <Grid container direction="row" spacing={8} justify="center">
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
          <Grid item xs={12} sm={12} md={8}>
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
      <br />
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <ListAlt className={classes.dashboardIcon} fontSize="large" color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h5">
            Logs
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Paper className={classes.tableContainer} elevation={4}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Query</TableCell>
                <TableCell>Error</TableCell>
                <TableCell align="right">Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log: ApiLog) => {
                const date: Date = new Date(Number(log.timestamp) * 1000);
                const dateStr: string = moment(date).format('LLL');
                
                return (
                  <TableRow key={log.timestamp}>
                    <TableCell component="th" scope="row">
                      {dateStr}
                    </TableCell>
                    <TableCell style={{ maxWidth: "200px" }}>
                      {log.query.replace('/articles/', '').split('&').map((section: string, i: number) => (
                        <div>{i !== 0 && "&"}{section}</div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {log.error ? (
                        <>
                          <div style={{ fontWeight: "bold" }}>
                            {log.error.errorName}
                          </div>
                          <div>
                            {log.error.errorMessage}
                          </div>
                        </>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="button" 
                        style={{ color: log.success ? "green" : "red" }}
                      >
                        {log.success ? "Successful" : `Error (${log?.error?.errorNo})`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default Dashboard;
