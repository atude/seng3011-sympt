import React from 'react';
import {
  Toolbar, 
  AppBar, 
  Typography, 
  makeStyles, 
  Theme, 
  createStyles, 
} from '@material-ui/core';
import banner from '../assets/banner-plain.png';

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
    banner: {
      width: "7em",
    },
  }),
);

const Topbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <img src={banner} alt="sympt" className={classes.banner} />
          <Typography variant="h6">
            API Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};


export default Topbar;
