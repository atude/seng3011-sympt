import * as admin from 'firebase-admin';

export const articlesRef = admin.firestore().collection("articles");
export const apiUsersRef = admin.firestore().collection("apiUsers");
