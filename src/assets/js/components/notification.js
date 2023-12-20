"use strict";

import { popUnreadNotifications as fetchUnreadNotifications } from "../api.js";
import { getIdentity } from "../storage.js";

document.addEventListener("DOMContentLoaded", function() {
    setInterval(() => fetchUnreadNotifications(getIdentity(), displayNotifications), 10000);
});

function displayNotifications(notifications) {
    if ("Notification" in window) {
        // Request permission to show notifications
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                // Array to store notifications
                const notificationArray = [];

                // Function to create and display a notification
                function createNotification(message) {
                    return new Notification(message, {
                        icon: "assets/images/logo.png"
                    });
                }

                // Add notifications to the array
                notifications.forEach(function (notificationData) {
                    const message = `${notificationData.event.subject}: ${notificationData.event.reason}`;
                    const notification = createNotification(message);
                    notificationArray.push(notification);
                });

                // Close the notification when it's clicked
                notificationArray.forEach(function (notification) {
                    notification.onclick = function () {
                        notification.close();
                    };
                });
            }
        });
    } else {
        console.log("This browser does not support notifications.");
    }
}
