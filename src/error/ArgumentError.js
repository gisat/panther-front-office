/**
 *
 * @param message Message to be displayed
 * @constructor
 */
class ArgumentError extends Error {
    constructor(message) {
        super();

        this.name = "ArgumentError";
        this.message = message || '';
    };
}

export default ArgumentError;