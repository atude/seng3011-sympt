import * as admin from 'firebase-admin';
import { ApiUser } from '../types';

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
