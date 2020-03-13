import * as admin from 'firebase-admin';

// TODO: Allow env changing (service account change ?)

export const articlesPromedRef = admin.firestore().collection("articles-promed");
export const apiUsersRef = admin.firestore().collection("api-users");
