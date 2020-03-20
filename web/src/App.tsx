import React, { useState } from 'react';
import {
  CircularProgress,
  makeStyles, 
  Theme, 
  createStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core';
import { purple, blueGrey } from '@material-ui/core/colors';

import firebase from './firebase/firebaseInit';
import Topbar from './components/Topbar';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

/* Main theming */
const mainTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: purple[800],
    },
    secondary: {
      main: blueGrey[800],
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      margin: "auto",
    },
    main: {
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);

function App() {
  console.log(`Firebase init: ${!!firebase}`);
  const classes = useStyles();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  firebase.auth().onAuthStateChanged((currUser) => {
    if (currUser) {
      setUser(currUser);
      console.log(`Auth state changed => ${currUser.email}`);
    } else {
      setUser(null);
    }

    setLoading(false);
  });

  return (
    <MuiThemeProvider theme={mainTheme}>
      <div className={classes.root}>
        <Topbar />
        <div className={classes.main}>
          {loading ? 
            <CircularProgress />
            : !user ? 
              <SignIn rootClasses={classes} /> : (
                <Dashboard 
                  rootClasses={classes}
                  user={user} 
                />
              )
          }
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
