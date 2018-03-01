/**
 *
 * @param message Message to be displayed
 * @constructor
 */
class NotFoundError extends Error {
    constructor(message) {
        super();

        this.name = "NotFoundError";
        this.message = message || '';
    };
}

export default NotFoundError;