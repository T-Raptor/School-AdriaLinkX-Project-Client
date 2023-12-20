function setIdentity(company) {
    localStorage.setItem("companyName", company);
}

function getIdentity() {
    localStorage.getItem("companyName");
}

export { setIdentity, getIdentity };
