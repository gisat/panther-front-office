/**
 * Base object for all view objects. It implements basic needed functionality/
 * @param options {Object}
 * @param options.listeners {Function[]} Functions which should work as listeners.
 * @constructor
 */
class View {
    constructor(options) {
        this._listeners = (options && options.listeners) || [];
    };


    /**
     * It allows to add listener for events emitted by this View.
     * @param name {string} Name of the listener
     * @param listener {Function} Listener to be added to the pool.
     */
    addListener(name, listener) {
        this._listeners.push({
            listener: listener,
            name: name
        });
    };

    /**
     * It notifies all listeners with given event.
     * @param event {String} Name of the event.
     */
    notify(event) {
        this._listeners.forEach(function (listener) {
            if (event === listener.name) {
                listener(event);
            }
        });
    };

    /**
     * It decides whether for current event special key was pressed.
     * @param e {Event} Event for which we lookup the special keys
     * @returns {boolean} True if the special key was pressed.
     */
    specialKeyPressed(e) {
        return e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey;
    };
}

export default View;