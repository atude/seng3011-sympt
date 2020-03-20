import firebase from './firebaseInit';

const usersRef = firebase.firestore().collection("users");

export const signInEmail = async (email: string, password: string) => {
  const response = await firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error.message);
      return (error);
    });

  return response;
};

export const createAccount = async (email: string, password: string) => {
  const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credentials) => {
      // Create user in backend
      usersRef.doc(email).set({
        log: [],
      });

      console.log(`Made new user => ${credentials?.user?.email}`);
    })
    .catch((error) => {
      console.log(error.message);
      return (error);
    });
  
  return response;
};

export const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Signed out");
  }).catch((error) => {
    console.log(error.message);
  });
};

export const refreshToken = async () => {
  const token = await firebase.auth().currentUser?.getIdToken(true);
  return token;
};
