const axios = require("axios");

function sanitizeString(chaine){
    chaine.trim();

    let spe = [' ', '<', '>', '\'', 'é', 'è', 'ê', 'ë', 'á', 'ä', 'à', 'â', 'î', 'ï', 'ö', 'ô', 'ù', 'û',
        'É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Á', 'Î', 'Ï', 'Ô', 'Ù', 'Û', 'ç','Ç'];
    let changer = ['-', '-', '-', '', 'e','e','e','e','á','a','a','a','i','i','o','o','u','u',
        'E','E','E','E','A','A','A','I','I','O','U','U','c','C'];

    spe.forEach((elem, index) => {
        chaine = chaine.replace(elem, changer[index]);
    })
    chaine = chaine.replace(/\s+/g, '-');
    chaine = chaine.toLowerCase();

    return chaine;
}

function toFormatTime(date, timezone="UTC"){
    let ne = date.toLocaleString('fr-FR', { timeZone: timezone })
    return ne.substr(ne.length - 8,ne.length);
}

function toFormatDate(date, timezone="UTC"){
    return date.toLocaleDateString('fr-FR', { timeZone: timezone });
}

function toFormatDateTime(date, timezone="UTC"){
    return date.toLocaleString('fr-FR', { timeZone: timezone });
}

function toFormatPhone(elem){
    if(elem !== "" && elem !== undefined && elem !== null){
        let arr = elem.match(/[0-9-+]/g);
        if(arr != null) {
            elem = arr.join('');
            if (!(/^((\+)33|0)[1-9](\d{2}){4}$/.test(elem))) {
                return elem;
            } else {
                let a = elem.substr(0, 2);
                let b = elem.substr(2, 2);
                let c = elem.substr(4, 2);
                let d = elem.substr(6, 2);
                let e = elem.substr(8, 2);

                return a + " " + b + " " + c + " " + d + " " + e;
            }
        }
        return elem;
    }else{
        return "";
    }
}

function processData(allText){
    let allTextLines = allText.split(/\r\n|\n/);
    let headers = allTextLines[0].split(';');
    let lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        let data = allTextLines[i].split(';');

        lines.push({"cp": data[2], "city": data[1]});
    }

    return lines;
}

function getPostalCodes(self){
    axios.get( window.location.origin + "/postalcode.csv", {})
        .then(function (response) {
            self.setState({ arrayPostalCode: processData(response.data) })
        })
    ;
}
function toCurrency(price){
    return new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(price);
}

module.exports = {
    sanitizeString,
    getPostalCodes,
    toFormatTime,
    toFormatDate,
    toFormatDateTime,
    toFormatPhone,
    toCurrency
}