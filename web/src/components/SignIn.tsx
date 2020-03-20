import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { CircularProgress } from '@material-ui/core';
import { signInEmail, createAccount } from '../firebase/firebaseFunctions';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Sympt
      </Link>
      {' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const SignIn = (props: any) => {
  const classes = useStyles();

  const [isSignIn, setSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (isSignIn) {
      const attemptSignIn = await signInEmail(email, password);
      if (attemptSignIn.message) {
        setError(attemptSignIn.message);
      }
    } else {
      const attemptSignUp = await createAccount(email, password);
      if (attemptSignUp.message) {
        setError(attemptSignUp.message);
      }
    }

    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Typography>
        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={!!error}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleSubmit()}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
          <Grid container justify="center" direction="column" alignItems="center">
            {loading && (
              <Grid item>
                <CircularProgress />
              </Grid>
            )}
            <Grid item>
              <Button variant="text" color="secondary" onClick={() => setSignIn(!isSignIn)}>
                {isSignIn ? 
                  "Don't have an account? Sign Up" :
                  "Already have an account? Sign In"
                }
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignIn;
