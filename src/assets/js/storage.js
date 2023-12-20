function setIdentity(company) {
    localStorage.setItem("companyName", company);
}

function getIdentity() {
    return localStorage.getItem("companyName");
}

function requireIdentity() {
    const identity = getIdentity();
    if (identity == null) {
        setIdentity("Duertos");
    }
    return getIdentity();
}

export { setIdentity, getIdentity, requireIdentity };
