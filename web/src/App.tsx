import React, { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import firebase from './firebase/firebaseInit';
import Topbar from './components/Topbar';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

function App() {
  console.log(`Firebase init: ${!!firebase}`);
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
    <div>
      <Topbar />
      {loading ? 
        <CircularProgress />
        : !user ? 
          <SignIn /> : (
            <Dashboard 
              user={user} 
            />
          )
      }
    </div>
  );
}

export default App;
