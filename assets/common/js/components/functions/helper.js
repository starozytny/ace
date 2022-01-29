const axios = require("axios");

function addProcessZipcode(lines, data)
{
    lines.push({"cp": data[2], "city": data[1]});
    return lines;
}

function processData(allText, type = "zipcode")
{
    let allTextLines = allText.split(/\r\n|\n/);
    let headers = allTextLines[0].split(';');
    let lines = [];

    for (let i=1; i<allTextLines.length; i++) {
        let data = allTextLines[i].split(';');

        if(type === "zipcode"){
            lines = addProcessZipcode(lines, data)
        }
    }

    return lines;
}

function getPostalCodes(self)
{
    axios.get( window.location.origin + "/postalcode.csv", {})
        .then(function (response) {
            self.setState({ arrayPostalCode: processData(response.data) })
        })
    ;
}

function setCityFromZipcode(self, e, arrayPostalCode)
{
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    if(value.length <= 5){
        self.setState({ [name]: value })

        let v = ""
        if(arrayPostalCode.length !== 0){
            v = arrayPostalCode.filter(el => el.cp === value)

            if(v.length === 1){
                self.setState({ city: v[0].city })
            }
        }
    }
}

function setActive(tab, value)
{
    let active = "";
    tab.forEach(elem => {
        if(elem === value){
            active = " active";
        }
    })

    return active;
}

function setActiveByValue(tab, value)
{
    let active = "";
    tab.forEach(elem => {
        if(elem.value === value){
            active = " active";
        }
    })

    return active;
}

function createTimeHoursMinutes(hours, minutes)
{
    let date = new Date();
    date.setHours(hours); date.setMinutes(minutes);

    return date;
}

function setIncludeTimes(startHours, endHours, startMinutes, endMinutes)
{
    let includeTimes = [];
    for(let i=startHours; i <= endHours ; i++){
        for(let j=startMinutes; j <= endMinutes ; j++){
            let includeTime = new Date();
            includeTime.setHours(i); includeTime.setMinutes(j);
            includeTimes.push(includeTime)
        }
    }

    return includeTimes;
}

function extractDateToArray(date){
    if(date !== "" && date !== null){
        let string = date.toLocaleString('fr-FR').slice(0,10).replace(/-/g,'');
        string = string.split('/');


        if(string.length !== 3){
            return "";
        }

        return [parseInt(string[0]), parseInt(string[1]), parseInt(string[2])];
    }

    return "";
}

/**
 * start doit être inférieur à end
 * @param startArray - array [d,m,y]
 * @param endArray - array [d,m,y]
 */
function getNbDayBetweenDateArray(startArray, endArray)
{
    let startYear  = startArray[2];
    let startMonth = startArray[1];
    let startDay   = startArray[0];
    let endYear    = endArray[2];
    let endMonth   = endArray[1];
    let endDay     = endArray[0];

    let nbDaysByMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let nbYears = endYear - startYear

    let days = 0;
    if(nbYears >= 0){
        if(nbYears === 0){ // même année
            if(startMonth === endMonth){ // même mois
                days = endDay - startDay + 1;
                days = days === 0 ? 1 : days;
            }else if(startMonth < endMonth){ // classique date
                days = days + (nbDaysByMonth[startMonth] - startDay + 1); //calcul en fonction du nb de jours dans le current mois
                days = days + endDay;
                for(let i = startMonth + 1 ; i < endMonth ; i++){ //ajout des jours entre les mois exclusion mois start et end
                    days = days + nbDaysByMonth[i];
                }
            }
        }else{
            //remplir les jours du current start mois et end mois
            days = days + (nbDaysByMonth[startMonth] - startDay + 1);
            days = days + endDay;

            //remplir les mois restants du start jusqu'a la nouvelle année
            for(let i = startMonth + 1 ; i <= 12 ; i++){
                days = days + nbDaysByMonth[i];
            }
            //remplir les mois avant end mois
            for(let i = 1 ; i < endMonth ; i++){
                days = days + nbDaysByMonth[i];
            }

            //remplir les années restantes exclusion année start et end
            for(let i = startYear + 1 ; i < endYear ; i++){
                days = days + 365;
            }
        }
    }

    return days;
}

function downloadBinaryFile(data, filename, targetBlank=false) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    if(targetBlank){
        link.setAttribute("target", "_blank");
    }
    link.setAttribute('download', filename); //or any other extension
    document.body.appendChild(link);
    link.click();
}

function toTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

module.exports = {
    getPostalCodes,
    setCityFromZipcode,
    setActive,
    setActiveByValue,
    setIncludeTimes,
    createTimeHoursMinutes,
    extractDateToArray,
    getNbDayBetweenDateArray,
    downloadBinaryFile,
    toTop
}