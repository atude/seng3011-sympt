import React from 'react';
import {
  Toolbar, 
  AppBar, 
  Typography, 
  makeStyles, 
  Theme, 
  createStyles, 
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    toolbar: {
      justifyContent: "space-between",
    },
  }),
);

const Topbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">
            sympt
          </Typography>
          <Typography variant="h6">
            API Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};


export default Topbar;
