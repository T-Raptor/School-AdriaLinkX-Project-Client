"use strict";

import { popUnreadNotifications as fetchUnreadNotifications } from "../api.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Fetch unread notifications and display them as notifications
    fetchUnreadNotifications(displayNotifications);
}

function displayNotifications(notifications) {
    if ("Notification" in window) {
        // Request permission to show notifications
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                // Array to store notifications
                let notificationArray = [];

                // Function to create and display a notification
                function createNotification(message) {
                    return new Notification(message, {
                        icon: "path/to/icon.png"
                    });
                }

                // Add notifications to the array
                notifications.forEach(function (notificationData) {
                    const message = `Notification: ${notificationData.event.subject}`; //Please edit the event.subject to the correct value
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
