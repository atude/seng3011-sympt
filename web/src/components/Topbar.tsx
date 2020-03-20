import React from 'react';
import {
  Toolbar, 
  AppBar, 
  IconButton, 
  Typography, 
  makeStyles, 
  Theme, 
  createStyles, 
} from '@material-ui/core';
import {
  Menu as MenuIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const Topbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            sympt API
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};


export default Topbar;
