"use strict";
// // notificationService.ts
// import * as admin from 'firebase-admin';
// import NotificationModel from '../models/notification'; // Adjust the import path as necessary
// // Initialize Firebase Admin SDK with your project's credentials
// // Make sure to replace the path with the actual path to your Firebase service account key file
// const serviceAccount = require('../ncc-db247-firebase-adminsdk-7mpu9-6f9d75dbce.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// /**
//  * Sends a notification based on the saved notification document ID.
//  * 
//  * @param notificationId The ID of the notification document in the database.
//  */
// export const sendNotification = async (notificationId: string): Promise<void> => {
//   try {
//     // Find the notification document by ID
//     const notification = await NotificationModel.findById(notificationId);
//     // If the notification does not exist, log an error and return
//     if (!notification) {
//       console.error('Notification not found:', notificationId);
//       return;
//     }
//     // Define the notification payload
//     const payload = {
//       notification: {
//         title: 'Event Reminder', // You can customize this title
//         body: notification.message, // The message field from the notification document
//       },
//     };
//     // Send the notification to the device token specified in the notification document
//     await admin.messaging().sendToDevice(notification.deviceToken, payload);
//     console.log('Notification sent successfully');
//     // Optionally, update the notification document to mark it as sent
//     await NotificationModel.findByIdAndUpdate(notificationId, { sent: true });
//   } catch (error) {
//     // Log and rethrow the error for further handling
//     console.error('Error sending notification:', error);
//     throw error;
//   }
// };
