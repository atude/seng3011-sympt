import * as admin from 'firebase-admin';

// TODO: Allow env changing (service account change ?)

export const articlesRef = admin.firestore().collection("articles");
export const apiUsersRef = admin.firestore().collection("apiUsers");
