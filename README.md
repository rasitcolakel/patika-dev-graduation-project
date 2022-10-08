<h1>PATIKA REACT NATIVE GRADUATION PROJECT</h1>
This is a project for Patika.dev React Native Bootcamp. It is a messaging app that uses Firebase for authentication and database.

<h2>Required Softwares</h2>

---

<li>Node 16</li>
<li>Yarn</li>
<li>Xcode</li>
<li>Android Studio</li>
<br/>

<h2>Installation</h2>

---

Clone the project

```bash
git clone
```

Go to the project directory

```bash
cd patika-react-native-graduation-project
```

Install dependencies

```bash
yarn
```

Start Metro

```bash
yarn start
```

Start the app

```bash
yarn android
yarn ios
```

## Screenshots

## Used Technologies

In this project, I used the following technologies:

<ul class="list-group list-group-flush">
<li class="list-group-item">React Native</li>
<li class="list-group-item">Expo
    <ul>
        <li class="list-group-item">Expo CLI</li>
        <li class="list-group-item">Expo Go</li>
        <li class="list-group-item">Expo Notifications</li>
        <li class="list-group-item">Expo Image Picker</li>
        <li class="list-group-item">Expo Location</li>
        <li class="list-group-item">Expo Camera</li>
    </ul>

</li>
<li class="list-group-item">Firebase
    <ul>
        <li class="list-group-item">Firebase Authentication</li>
        <li class="list-group-item">Firebase Firestore</li>
        <li class="list-group-item">Firebase Storage</li>
        <li class="list-group-item">Firebase Functions</li>
    </ul>
</li>

<li class="list-group-item">React Navigation</li>
<li class="list-group-item">Native Base</li>
</ul>
<br />
<h2><b> React Native </b></h2>

---

<p>React Native is an open-source mobile application framework created by Facebook, Inc. It is used to develop applications for Android, Android TV, iOS, macOS, and more.</p>

<h2><b> Expo </b></h2>

---

<p>Expo is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React.</p>

<h2><b> Firebase </b></h2>
<p>Firebase is a platform developed by Google for creating mobile and web applications.</p>

<h3> Usage </h3>

Firstly, we need to configure Firebase in our project.

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth to use signup and login
export const auth = getAuth(app);

// Initialize Firebase firestore to use database
export const db = getFirestore(app);

// Initialize Firebase storage to use storage
export const storage = getStorage(app);
```

Now we can use Firebase Authentication in our project.

<h3> Firebase Authentication Usage </h3>

```typescript
import { auth } from '../firebase';

// Sign up
auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });

// Sign in
auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });

// Sign out
auth.signOut().then(() => {
    // Sign-out successful.
});

// Get current user
const user = auth.currentUser;
```

---

<h3> Firebase Firestore Usage </h3>

```typescript
import { db } from '../firebase';

// Get a document

const docRef = doc(db, 'users', '1');
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
} else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
}

// Get a collection
const collectionRef = collection(db, 'users');
const querySnapshot = await getDocs(collectionRef);

querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
});

// Add a document
const docRef = await addDoc(collection(db, 'users'), {
    firstName: 'Raşit',
    lastName: 'Çolakel',
    email: 'rasitcolakel@hotmail.com'
});

// Update a document
const docRef = doc(db, 'users', '1');
await updateDoc(docRef, {
    firstName: 'Raşit',
    lastName: 'Çolakel',
    email: 'rasitcolakel@hotmail.com.tr'
});

// Delete a document
const docRef = doc(db, 'users', '1');
await deleteDoc(docRef);
```
