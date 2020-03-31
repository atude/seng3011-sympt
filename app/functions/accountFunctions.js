import firebase from '../firebase/firebaseInit';

// const usersRef = firebase.firestore().collection("users");

export const signInEmail = async (email, password) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
      console.warn(error.message);
      return(error);
    });
};

export const createAccount = async (email, password) => {
  // Check if username unused
  // const getUser = await getUserByUsername(username);
  // console.log(getUser);
  // if(getUser) return "Username has been taken.";

  //Create auth details
  return await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credentials) => {
    // Create firestore doc for user
    // usersRef.doc(username.toLowerCase()).set({
    //   id: credentials.user.uid,
    //   email: credentials.user.email
    // });

      console.log("Made new user => " + credentials.user.email);
    })
    .catch(error => {
      console.warn(error.message);
      return(error);
    });
};

export const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Signed out");
  }).catch(error => {
    console.log(error.message);
  });
};