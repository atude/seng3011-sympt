import firebase from '../firebase/firebaseInit';
const usersRef = firebase.firestore().collection("users");


export const setSymptoms = (userContext, selectedMap) => {
  const selectedSymptoms = [...selectedMap.keys()];

  usersRef.doc(userContext.user.email).set({
    symptoms: selectedSymptoms,
  });
};

// export const getSymptoms = (userContext) => {
//     usersRef.doc(userContext.user.email).get(
        
//     )
// }



// export const getSelfReportedCases = () => { // Should return array of coordinates of sick people... 


// }
