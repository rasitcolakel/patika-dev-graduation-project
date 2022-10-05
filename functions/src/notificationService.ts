// expo-server-sdk usage

import {Expo, ExpoPushMessage} from "expo-server-sdk";

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
