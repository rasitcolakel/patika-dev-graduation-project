import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// when message created in firestore
export const onMessageCreate = functions
    .region("europe-west1")
    .firestore
    .document("chats/{chatId}/messages/{messageId}")
    .onCreate(async (snap, context) => {
      // get new value
      const newValue = snap.data();
      const chat = await db.collection("chats")
          .doc(context.params.chatId).get();
      const members = chat?.data()?.members;
      console.log("members", members);
      const receiver = members.
          find((m: string) => m !== newValue?.senderId);

      if (receiver) {
        const user = await db.collection("users")
            .doc(receiver).get();
        console.log("user", user);
      }
      // get a document reference
      // access a particular field as you would any JS property
      console.log("newValue", newValue);
      console.log("context.params", context.params);

      // perform desired operations ...
    });
