import * as admin from 'firebase-admin';
import { ApiUser } from '../types';
import { formatUserDetails } from '../utils/formatters';

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

export const addUserDetails = async (queryUrl: string) => {
  const { symptoms, details } = formatUserDetails(queryUrl);

  console.log("symptoms and details", symptoms, details);
  // Weird firebase stuff goes here 
};
