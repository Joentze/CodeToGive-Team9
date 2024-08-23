// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDPWDM53zQi5HvCZiurfV3PlL2N_VrYFAU",
    authDomain: "foodbanksg-744e7.firebaseapp.com",
    projectId: "foodbanksg-744e7",
    storageBucket: "foodbanksg-744e7.appspot.com",
    messagingSenderId: "666771643504",
    appId: "1:666771643504:web:5e72e235f8939799bca8b5",
    measurementId: "G-L9W0VY0VRS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const store = getFirestore(app)