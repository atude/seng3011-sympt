import * as admin from 'firebase-admin';
import * as serviceAccount from './service-account.json';

require('dotenv').config();

admin.initializeApp({ 
  credential: admin.credential.cert({
    ...serviceAccount,
    private_key: process.env.FIREBASE_KEY?.replace(/\\n/g, '\n') ?? "",
  } as admin.ServiceAccount),
});

export default admin;
