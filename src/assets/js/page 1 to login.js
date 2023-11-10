"use strict";
document.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelector("#login_button").addEventListener("click", login);
    document.querySelector("#reservation").addEventListener("click", reservation);
}

function login() {
    window.location.href = "login.html";
    console.log("login");
}
function reservation() {
    window.location.href = "reservation.html";
    console.log("reservation");
}



