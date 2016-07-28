define([], function () {
    /**
     * It returns string representing the value. There is a comma after every third digit
     * @param  value {number}
     * @returns {string}
     */
    function thousandSeparator (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return {
        thousandSeparator: thousandSeparator
    };
});