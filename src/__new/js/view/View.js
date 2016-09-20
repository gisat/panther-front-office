define([], function () {
    "use strict";
    /**
     * Base object for all view objects. It implements basic needed functionality/
     * @param options {Object}
     * @param options.listeners {Function[]} Functions which should work as listeners.
     * @constructor
     */
    var View = function(options) {
        this._listeners = (options && options.listeners) || [];
    };

    /**
     * It allows to add listener for events emitted by this View.
     * @param listener {Function} Listener to be added to the pool.
     */
    View.prototype.addListener = function(listener) {
        this._listeners.push(listener);
    };

    /**
     * It notifies all listeners with given event.
     * @param event {String} Name of the event.
     */
    View.prototype.notify = function(event) {
        this._listeners.forEach(function(listener){
            listener(event);
        });
    };

    /**
     * It decides whether for current event special key was pressed.
     * @param e {Event} Event for which we lookup the special keys
     * @returns {boolean} True if the special key was pressed.
     */
    View.prototype.specialKeyPressed = function (e) {
        return e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey;
    };

    return View;
});