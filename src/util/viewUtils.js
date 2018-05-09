let Config = window.Config;
let ThemeYearConfParams = window.ThemeYearConfParams;

/**
 * It returns string representing the value. There is a comma after every third digit
 * @param value {number}
 * @param separateThousands {boolean} true if thousands should be separated by comma
 * @param decimalDigits {number} number of decimal digits
 * @returns {string|number}
 */
function numberFormat(value, separateThousands, decimalDigits) {
    if (value < 1000) {
        if (Config.toggles.isMelodies && Number(ThemeYearConfParams.dataset) === 57) {
            return parseFloat(value).toFixed(0);
        }
        return (Math.round(value * (100)) / (100));
    }

    else if (separateThousands && value >= 1000) {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

function isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    let n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

/**
 * @returns {string} Pseudorandom color from the list of colors
 */
function getPseudorandomColor() {
    let position = Math.floor(Math.random() * 8);
    let colors = [
        '#BBBB88',
        '#EEDD99',
        '#EEC290',
        '#EEAA88',
        '#73A8AF',
        '#FF9E9D',
        '#B2B6AB',
        '#7FC7AF'
    ];
    return colors[position];
}

export default {
    getPseudorandomColor: getPseudorandomColor,
    isNaturalNumber: isNaturalNumber,
    numberFormat: numberFormat
};