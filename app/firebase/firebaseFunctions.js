import firebase from './firebaseInit';

const usersRef = firebase.firestore().collection("users");

export const signInEmail = async (email, password) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(error => {
    const { code, message } = error;
    console.warn(message);
    return(message);
  });
}

export const createAccount = async (email, password, username) => {
  // Check if username unused
  // const getUser = await getUserByUsername(username);
  // console.log(getUser);
  // if(getUser) return "Username has been taken.";

  //Create auth details
  return await firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((credentials) => {
    //Create username in auth to link to firestore data
    credentials.user.updateProfile({
      displayName: username.toLowerCase()
    });

    //Create firestore doc for user
    usersRef.doc(username.toLowerCase()).set({
      id: credentials.user.uid,
      email: credentials.user.email
    });

    console.log("Made new user => " + credentials.user.email);
  })
  .catch((error) => {
    const { code, message } = error;
    console.warn(message);
    return(message);
  });
}

export const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Signed out");
  }).catch(error => {
    console.log(error.message);
  });
}

