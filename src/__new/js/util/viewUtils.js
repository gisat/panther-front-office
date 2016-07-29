define([], function () {
    /**
     * It returns string representing the value. There is a comma after every third digit
     * @param  value {number}
     * @returns {string}
     */
    function thousandSeparator (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function isNaturalNumber(n) {
        n = n.toString(); // force the value incase it is not
        var n1 = Math.abs(n),
            n2 = parseInt(n, 10);
        return !isNaN(n1) && n2 === n1 && n1.toString() === n;
    }

    return {
        isNaturalNumber: isNaturalNumber,
        thousandSeparator: thousandSeparator
    };
});