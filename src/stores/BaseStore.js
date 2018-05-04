import _ from 'underscore';

import Logger from '../util/Logger';
import NotOverriddenError from '../error/NotOverriddenError';
import Remote from '../util/Remote';

let Config = window.Config;

/**
 * Base class for retrieving model information from the server. It serves as a repository.
 * @constructor
 * @alias BaseStore
 * @param options {Object}
 * @param options.models {Model[]} It is possible to supply models. If models are supplied this way. Load
 * function isn't internally called. It is still possible to use it from outside to refresh the data.
 */
class BaseStore {
    constructor(options) {
        options = options || {};
        this._models = options.models || null;
        this._listeners = [];
    };

    /**
     * Clear store
     */
    clear() {
        this._models = null;
    };

    /**
     * It returns the promise of all loaded models. It doesn't by default saves the information into the store.
     * @param options {Object}
     * @param options.params {Object} Parameters, which should be appended to the request.
     * @return {Promise} Promise of the models to be delivered.
     */
    load(options) {
        options = options || {};
        let self = this;
        return new Promise(function (resolve, reject) {
            new Remote({
                method: "GET",
                url: Config.url + self.getPath(),
                params: options.params || {}
            }).then(function (dataFromApi) {
                console.log('Path: ', self.getPath());
                dataFromApi = JSON.parse(dataFromApi);
                // User and Group endpoint return twice wrapped information.
                try {
                    if (!dataFromApi.data) {
                        dataFromApi = JSON.parse(dataFromApi);
                    }
                } catch (e) {
                }
                let models = [];
                if (_.isArray(dataFromApi.data)) {
                    dataFromApi.data.forEach(function (model) {
                        model.params = options.params;
                        models.push(self.getInstance(model));
                    });
                } else {
                    dataFromApi.data.params = options.params;
                    models.push(self.getInstance(dataFromApi.data));
                }
                Promise.all(models).then(models => {
                    self.loaded(models);
                    resolve(models);
                });
            }, reject).catch(function (error) {
                console.log('BaseStore#load Error: ', error);
                reject(error);
            });
        });
    };

    /**
     * Hook for descendants to know that loading was finished.
     */
    loaded() {

    };

    /**
     * It specifies path on the server for retrieving models for current store.
     * @return {String} Path on the server.
     * @throws NotOverriddenError If it wasn't overridden by subclasses.
     */
    getPath() {
        throw new NotOverriddenError(
            Logger.logMessage(Logger.LEVEL_INFO, "Gisat", "getPath", "Get Path must be overridden by subclasses.")
        );
    };

    /**
     * It allows you to specify the process for retrieving the instance based on the data.
     * @param dataFromApi {Object} Object to be transformed into the model.
     * @return {Model} Instantiated Model.
     */
    getInstance(dataFromApi) {
        throw new NotOverriddenError(
            Logger.logMessage(Logger.LEVEL_INFO, "Gisat", "getInstance", "Get Instance must be overridden by" +
                " subclasses.")
        );
    };

    /**
     * Adds listener to the pool of listeners.
     * @param listener {Function} Function to be added as a listener.
     */
    addListener(listener) {
        this._listeners.push(listener);
    };

    removeLastListener() {
        this._listeners.pop();
    };

    /**
     * Notifies all listeners.
     * @param event {Object|string} Object representing information about event. Type of event, if string.
     * @param options {Object}
     */
    notify(event, options) {
        this._listeners.forEach(function (listener) {
            listener(event, options);
        });
    };

    /**
     * Finds model by id.
     * @param id {Object} Id of the element to retrieve.
     * @returns {Promise} Promise of the array containing one data element.
     */
    byId(id) {
        return this.filter({id: id});
    };

    /**
     * Finds all models.
     * @returns {Promise} Promise of all elements available under the directory.
     */
    all() {
        if (!this._models) {
            this._models = this.load();
        }
        return this._models;
    };

    /**
     * Finds subset of all models available in this repository. It supports value as a Array meaning that if the
     * value is in this array it should remain. It checks for equality using != operator meaning that 1 and "1" is
     * equal for our purposes.
     * @params options {Object} Options for filtering.
     * @returns {Promise} Promise of all elements available under the directory.
     */
    filter(options) {
        if (!this._models) {
            this._models = this.load();
        }
        let self = this;
        return new Promise(function (resolve, reject) {
            self._models.then(function (models) {
                let filtered = models.filter(function (model) {
                    let shouldRemain = true;

                    // If it doesn't satisfy all the conditions. Array means that the attribute under the key must be
                    // contained in the value to succeed.
                    _.each(options, function (value, key) {
                        if (_.isArray(value) && !_.isArray(model[key])) {
                            if (_.isEmpty(value)) {
                                return;
                            }
                            if (!_.contains(value, model[key])) {
                                shouldRemain = false;
                            }
                        } else if (!_.isArray(value) && _.isArray(model[key])) {
                            if (!_.contains(model[key], value)) {
                                shouldRemain = false;
                            }
                        } else {
                            if (typeof model[key] === "boolean") {
                                if (model[key] !== value) {
                                    shouldRemain = false;
                                }
                            }
                            else if (!model[key] || model[key] !== value) {
                                shouldRemain = false;
                            }
                        }
                    });
                    return shouldRemain;
                });

                resolve(filtered);
            }, function (err) {
                reject(err);
            })
        });
    };

}

export default BaseStore;