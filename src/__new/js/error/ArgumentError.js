define([], function () {
    "use strict";
    /**
     *
     * @param message Message to be displayed
     * @constructor
     */
    var ArgumentError = function(message) {
        this.name = "ArgumentError";
        this.message = message || '';
    };

    ArgumentError.prototype = Error.prototype;

    return ArgumentError;
});