"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    const companies = document.querySelectorAll("#company-list li");

    companies.forEach(li => li.addEventListener("click", addCompanySelector));
}

function addCompanySelector(e) {
    const companies = document.querySelectorAll("#company-list li");

    companies.forEach(li => li.classList.remove("active"));
    e.closest(li).classList.add("active");
}
