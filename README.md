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

<h2>Screenshots</h2>

---

<h2>Used Technologies</h2>

---

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

---

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

---

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

---

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

// Listen to a document
const docRef = doc(db, 'users', '1');
onSnapshot(docRef, (doc) => {
    console.log('Current data: ', doc.data());
});

// Listen to a collection

const collectionRef = collection(db, 'users');
onSnapshot(collectionRef, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
    });
});
```

<h3> Firebase Storage Usage </h3>

---

```typescript
import { storage } from '../firebase';

// Upload a file
const storageRef = ref(storage, 'images/1.jpg');
const response = await fetch('https://example.com/image.jpg');
const blob = await response.blob();
await uploadBytes(storageRef, blob);

// Get a file
const storageRef = ref(storage, 'images/1.jpg');
const url = await getDownloadURL(storageRef);
```

<br/>
<b><u> To use Firebase Functions, we need to install Firebase CLI. And, we need to login to Firebase CLI with your Google account.</u></b>

<br />
<h3> Installing Firebase CLI </h3>

```bash
npm install -g firebase-tools
```

<h3> Login to Firebase CLI </h3>

```bash
firebase login
```

<h3> Firebase Functions Usage </h3>
In this project, I used Firebase Functions to send notifications to users. I used Expo Notifications to send notifications to users with Expo Push Token.

---

Below, there is an illustration of how I used Firebase Functions in this project.

<img src="./screenshots/onMessageCreate.png" width="100%"/>

<br/>

<b> notificationService.ts</b> file under the ./functions/src

```typescript
// expo-server-sdk usage
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security

const expo = new Expo();

// Create the messages that you want to send to clients
export const sendNotification = async (message: ExpoPushMessage) => {
    const chunks = expo.chunkPushNotifications([message]);
    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
};
```

<b> index.ts </b> file under the ./functions/src

This function is triggered when a new document is added to the messages collection in the chats collection.

```typescript
import { ExpoPushMessage } from 'expo-server-sdk';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { sendNotification } from './notificationService';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// when message created in firestore
export const onMessageCreate = functions
    .region('europe-west1')
    .firestore.document('chats/{chatId}/messages/{messageId}')
    .onCreate(async (snap, context) => {
        // get new value
        const newValue = snap.data();
        const chat = await db
            .collection('chats')
            .doc(context.params.chatId)
            .get();
        const members = chat?.data()?.members;
        const receiverID = members.find(
            (m: string) => m !== newValue?.senderId,
        );
        if (receiverID) {
            const receiver = await db.collection('users').doc(receiverID).get();
            const pushToken = receiver?.data()?.pushToken;
            // if pushToken exists send notification
            if (pushToken) {
                const sender = await db
                    .collection('users')
                    .doc(newValue?.senderId)
                    .get();
                const senderName =
                    sender?.data()?.firstName + ' ' + sender?.data()?.lastName;

                let body = '';

                if (newValue?.type === 'text') {
                    body = newValue?.content?.text;
                } else if (newValue?.type === 'image') {
                    body = '📷 Image';
                } else if (newValue?.type === 'location') {
                    body = '📍 Location';
                }
                const message: ExpoPushMessage = {
                    to: pushToken as string,
                    title: senderName,
                    body,
                    sound: 'default',
                    data: {
                        type: 'message',
                        chatId: context.params.chatId,
                        senderId: newValue?.senderId,
                    },
                };
                await sendNotification(message);
            }
        }
        // get a document reference
        // access a particular field as you would any JS property
        console.log('newValue', newValue);
        console.log('context.params', context.params);
        // perform desired operations ...
    });
```

<h3> Deploying Firebase Functions </h3>

```bash
firebase deploy --only functions
```
