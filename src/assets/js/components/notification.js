"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    createNotification();

}

function createNotification() {
    // Let's check if the browser supports notifications


if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            let notification = new Notification("Hello, World!", {
                icon: "path/to/icon.png"
            });

            notification.onclick = function () {
                notification.close();
            };
        }
    });
} else {
    console.log("This browser does not support notifications.");
}
}