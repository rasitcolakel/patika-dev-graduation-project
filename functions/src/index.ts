import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {sendNotification} from "./notificationService";
import {ExpoPushMessage} from "expo-server-sdk";

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
      const receiverID = members.
          find((m: string) => m !== newValue?.senderId);
      if (receiverID) {
        const receiver = await db.collection("users")
            .doc(receiverID).get();
        const pushToken = receiver?.data()?.pushToken;
        // if pushToken exists send notification
        if (pushToken) {
          const sender = await db.collection("users")
              .doc(newValue?.senderId).get();
          const senderName = sender?.data()?.firstName +
          " " + sender?.data()?.lastName;

          let body = "";

          if (newValue?.type === "text") {
            body = newValue?.content?.text;
          } else if (newValue?.type === "image") {
            body = "📷 Image";
          } else if (newValue?.type === "location") {
            body = "📍 Location";
          }
          const message: ExpoPushMessage = {
            to: pushToken as string,
            title: senderName,
            body,
            sound: "default",
            data: {
              type: "message",
              chatId: context.params.chatId,
              senderId: newValue?.senderId,
            },
          };
          await sendNotification(message);
        }
      }
      // get a document reference
      // access a particular field as you would any JS property
      console.log("newValue", newValue);
      console.log("context.params", context.params);
      // perform desired operations ...
    });
