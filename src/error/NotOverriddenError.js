/**
 *
 * @param message Message to be displayed
 * @constructor
 */
class NotOverriddenError extends Error {
    constructor(message) {
        super();

        this.name = "NotFoundError";
        this.message = message || '';
    };
}

export default NotOverriddenError;