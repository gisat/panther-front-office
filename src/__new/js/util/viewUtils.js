define([], function () {
    /**
     * It returns string representing the value. There is a comma after every third digit
     * @param value {number}
     * @param separateThousands {boolean} true if thousands should be separated by comma
     * @param decimalDigits {number} number of decimal digits
     * @returns {string}
     */
    function numberFormat (value, separateThousands, decimalDigits) {
        if (value < 1000){
            if (Config.toggles.isMelodies && Number(ThemeYearConfParams.dataset) == 57){
                return parseFloat(value).toFixed(0);
            }
            return parseFloat(value).toFixed(decimalDigits);
        }

        else if (separateThousands && value >= 1000){
            return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    function isNaturalNumber(n) {
        n = n.toString(); // force the value incase it is not
        var n1 = Math.abs(n),
            n2 = parseInt(n, 10);
        return !isNaN(n1) && n2 === n1 && n1.toString() === n;
    }

    return {
        isNaturalNumber: isNaturalNumber,
        numberFormat: numberFormat
    };
});