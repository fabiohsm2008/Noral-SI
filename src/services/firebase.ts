import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVluuk1DFPo3BI3_YendgQbLm_8fdSk-I",
  authDomain: "noral-ventas.firebaseapp.com",
  projectId: "noral-ventas",
  storageBucket: "noral-ventas.appspot.com",
  messagingSenderId: "717597194235",
  appId: "1:717597194235:web:c897727e49407c80c1fd5e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
