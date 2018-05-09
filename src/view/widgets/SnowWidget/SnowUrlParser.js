let Config = window.Config;

class SnowUrlParser {

    /**
     * Parse url
     * @param url {string} URL of snow portal configuration
     */
    parse(url) {
        //"http://35.165.51.145/snow/great-britain/20170103-20170111/modis-terra-aqua_slstr-sentinel3/4-16"
        // todo replace mock with more sophisticated solution
        let path = url.replace(Config.snowUrl + "snow/", "");
        if (path.length < 1) {
            return null;
        }

        let components = path.split("/");
        let dates = this.parseDate(components[1]);
        let composites = [];
        let customComposites = components[3];
        if (customComposites && customComposites.charAt(0) !== "?") {
            composites = this.parseComposites(components[3]);
        }
        return {
            url: url,
            area: this.parseLocation(components[0]),
            dateFrom: dates[0],
            dateTo: dates[1],
            sensors: this.parseSensors(components[2]),
            composites: composites
        };
    };

    /**
     * @param locationString {string}
     * @returns {string}
     */
    parseLocation(locationString) {
        let location = locationString.split("-");
        let locParts = [];
        let self = this;
        location.forEach(function (name) {
            name = self.firstLetterToUppercase(name);
            locParts.push(name);
        });
        return locParts.join(" ");
    };

    /**

     * @param dateString {string}
     * @returns {[dateFrom, dateTo]}
     */
    parseDate(dateString) {
        let dates = dateString.split("-");
        let dateParts = [];
        let self = this;
        dates.forEach(function (date) {
            date = self.getFormattedDate(date);
            dateParts.push(date);
        });
        return dateParts;
    };

    /**
     * @param sensorsString
     * @returns {Object} satellites
     */
    parseSensors(sensorsString) {
        let satellites = sensorsString.split("_");
        let sats = {};
        let self = this;
        satellites.forEach(function (str) {
            let parts = str.split("-");
            let satellite = parts[0];
            sats[satellite] = [];
            parts.forEach(function (sensor, index) {
                if (index > 0) {
                    let sensorName = self.firstLetterToUppercase(sensor);
                    sats[satellite].push(sensorName);
                }
            });
        });
        return sats;
    };

    /**
     * @param compositesString {string}
     * @returns {Array}
     */
    parseComposites(compositesString) {
        let composites = compositesString.split("-");
        let compositesParts = [];
        composites.forEach(function (composite) {
            compositesParts.push(Number(composite));
        });
        return compositesParts;
    };

    /**
     * Get date in MM/DD/YYYY format
     * @param dateString {string}
     * @returns {string}
     */
    getFormattedDate(dateString) {
        let year = dateString.substring(0, 4);
        let month = dateString.substring(4, 6);
        let day = dateString.substring(6, 8);
        return month + "/" + day + "/" + year;
    };

    /**
     * Convert first letter of string to uppercase
     */
    firstLetterToUppercase(word) {
        return word.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
    };
}

export default SnowUrlParser;