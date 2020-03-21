import * as admin from 'firebase-admin';
import { ApiUser } from '../types';

export const verifyUser = async (authToken: string | undefined): Promise<ApiUser> => {
  try {
    const verifiedToken = await admin.auth().verifyIdToken(authToken || "");
    const user = await admin.auth().getUser(verifiedToken.uid);

    return {
      authenticated: true,
      email: user.email,
    } as ApiUser;
  } catch (error) {
    console.error(error);
  }

  return {
    authenticated: false,
    email: "null",
  } as ApiUser;
};

export const createUser = () => { };
