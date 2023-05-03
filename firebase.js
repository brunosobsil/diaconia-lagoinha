import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { ref, set, child, getDatabase, onValue, get, push, update, remove, onChildAdded, onChildChanged, onChildRemoved } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBuWvxjktbwkzyeZjPBnQ0z5vW-JGPhuKk",
    authDomain: "diaconia-lagoinha.firebaseapp.com",
    projectId: "diaconia-lagoinha",
    storageBucket: "diaconia-lagoinha.appspot.com",
    messagingSenderId: "182498372682",
    appId: "1:182498372682:web:80a28f721d36465fe44ab3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app, ref, set, child, getDatabase, onValue, get, push, update, remove, getAuth, onAuthStateChanged, onChildAdded, onChildChanged, onChildRemoved };