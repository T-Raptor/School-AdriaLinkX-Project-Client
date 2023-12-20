function setIdentity(company) {
    localStorage.setItem("companyName", company);
}

function getIdentity() {
    return localStorage.getItem("companyName");
}

export { setIdentity, getIdentity };
