// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyB98q1V8_cwjsbxSdjbvClKQRP4N_REwxI',
    authDomain: 'patika-graduation-project.firebaseapp.com',
    projectId: 'patika-graduation-project',
    storageBucket: 'patika-graduation-project.appspot.com',
    messagingSenderId: '1022665853162',
    appId: '1:1022665853162:web:e60fc88766c9eb4db06f93',
    measurementId: 'G-65N3JMKV1M',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth to use signup and login
export const auth = getAuth(app);

// Initialize Firebase firestore to use database
export const db = getFirestore(app);

// Initialize Firebase storage to use storage
export const storage = getStorage(app);
