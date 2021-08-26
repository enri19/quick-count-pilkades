import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBU89k8UPeqtjzo92cBDcN1sYLgwbjmAmA",
  authDomain: "e-voting-58c67.firebaseapp.com",
  databaseURL: "https://e-voting-58c67-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-voting-58c67",
  storageBucket: "e-voting-58c67.appspot.com",
  messagingSenderId: "165000455493",
  appId: "1:165000455493:web:6f6d58202d27de50ac4a2c",
  measurementId: "G-9CZWMWX34T"
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;