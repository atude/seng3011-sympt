import { ApiLog, ApiUser } from '../types';
import { apiUsersRef } from '../firebase/collectionReferences';

export const addLog = async (user: ApiUser, log: ApiLog) => {
  if (user.email !== "null") {
    const userDoc = await apiUsersRef.doc(user.email).get();
    if (userDoc.exists) {
      apiUsersRef.doc(user.email).update({
        [log.timestamp]: log,
      });
    } else {
      apiUsersRef.doc(user.email).set({
        [log.timestamp]: log,
      });
    }
  }
};
