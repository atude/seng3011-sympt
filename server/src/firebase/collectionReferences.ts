import * as admin from 'firebase-admin';

export const articlesRef = admin.firestore().collection("articles");
export const apiUsersRef = admin.firestore().collection("apiUsers");
export const casesRef = admin.firestore().collection("cases");
export const userInfoRef = admin.firestore().collection("userInfo");
