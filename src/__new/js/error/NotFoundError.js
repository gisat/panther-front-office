define([], function () {
    "use strict";
    /**
     *
     * @param message Message to be displayed
     * @constructor
     */
    var NotFoundError = function(message) {
        this.name = "NotFoundError";
        this.message = message || '';
    };

    NotFoundError.prototype = Error.prototype;

    return NotFoundError;
});