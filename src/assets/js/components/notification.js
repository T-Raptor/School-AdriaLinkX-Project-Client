"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    createNotification();

}

function createNotification() {
    if ("Notification" in window) {
        // Request permission to show notifications
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                // Array to store notifications
                let notifications = [];

                // Function to create and display a notification
                function createNotification(message) {
                    return new Notification(message, {
                        icon: "path/to/icon.png" // Replace with your own icon path
                    });
                }

                // Add notifications to the array
                notifications.push(createNotification("Notification 1"));
                notifications.push(createNotification("Notification 2"));
                notifications.push(createNotification("Notification 3"));

                // Close the notification when it's clicked
                notifications.forEach(function (notification) {
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