function compareFirstname(a, b){
    return comparison(a.firstname, b.firstname);
}

function compareLastname(a, b){
    return comparison(a.lastname, b.lastname);
}

function compareUsername(a, b){
    return comparison(a.username, b.username);
}

function compareTitle(a, b){
    return comparison(a.title, b.title);
}

function compareName(a, b){
    return comparison(a.name, b.name);
}

function compareCreatedAt(a, b){
    return comparison(a.createdAt, b.createdAt);
}

function compareCreatedAtInverse(a, b){
    return comparison(b.createdAt, a.createdAt);
}

function compareEmail(a, b){
    return comparison(a.email, b.email);
}

function comparison (objA, objB){
    let comparison = 0;
    if (objA > objB) {
        comparison = 1;
    } else if (objA < objB) {
        comparison = -1;
    }
    return comparison;
}

module.exports = {
    compareUsername,
    compareLastname,
    compareFirstname,
    compareTitle,
    compareName,
    compareCreatedAt,
    compareCreatedAtInverse,
    compareEmail
}