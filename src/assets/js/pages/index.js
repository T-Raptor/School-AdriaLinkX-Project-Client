"use strict";

import { getReservations } from "../api.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
    const loginButton = document.querySelector("#log-in");
    loginButton.addEventListener("click", login);

    const companies = document.querySelectorAll("#company-list button");
    companies.forEach(button => button.addEventListener("click", addCompanySelector));
}

function login(e) {
    e.preventDefault();

    const company = getSelectedCompany();
    let foundReservation = false;

    localStorage.setItem("companyName", company);

    getReservations(reservations => {
        reservations.forEach(reservation => {
            if (reservation.company === company) {
                foundReservation = true;
            }
        });

        if (foundReservation || company === "Admin") {
            window.location.href = "monitor.html";
        } else {
            window.location.href = "reserve.html";
        }
    });
}

function addCompanySelector(e) {
    e.preventDefault();

    document.querySelectorAll("#company-list li").forEach(li => li.classList.remove("selected"));

    e.target.closest("li").classList.add("selected");
}

function getSelectedCompany() {
    const companies = document.querySelectorAll("#company-list li");
    const selectedCompany = Array.from(companies).find(li => li.classList.contains("selected"));

    if (selectedCompany) {
        const companyName = selectedCompany.querySelector("button").innerText.trim();
        return companyName;
    } else {
        return null;
    }
}
