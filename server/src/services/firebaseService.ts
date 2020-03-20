import * as admin from 'firebase-admin';

export const checkAuthenticated = async (authToken: string | undefined): Promise<boolean> => {
  try {
    if (await admin.auth().verifyIdToken(authToken || "")) {
      return true;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
};

export const createUser = () => { };
