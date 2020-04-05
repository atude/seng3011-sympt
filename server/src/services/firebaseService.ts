import * as admin from 'firebase-admin';
import { ApiUser } from '../types';
import { formatUserDetails } from '../utils/formatters';
import { userInfoRef } from '../firebase/collectionReferences';

export const verifyUser = async (uid: string | undefined): Promise<ApiUser> => {
  try {
    const user = await admin.auth().getUser(uid || "");
    if (!user) {
      throw Error("Could not find user.");
    }
    return {
      authenticated: true,
      email: user.email,
    } as ApiUser;
  } catch {
    return {
      authenticated: false,
      email: "null",
    } as ApiUser;
  }
};

export const addUserDetails = async (queryUrl: string, userEmail: string) => {
  const { symptoms, details } = formatUserDetails(queryUrl);

  const userDetails = {
    symptoms,
    details,
  };

  try {
    const fetchCases = await userInfoRef
      .doc(userEmail)
      .set({ ...userDetails });
      
    return fetchCases;
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};
