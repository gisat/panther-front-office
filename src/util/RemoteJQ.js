

import ArgumentError from '../error/ArgumentError';
import Logger from './Logger';

let Config = window.Config;

/**
 * @param options {Object}
 * @constructor
 */
let $ = window.$;
class RemoteJQ {
    constructor(options) {
        if (!options.url) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "RemoteJQ", "constructor", "missingUrl"));
        }

        this._url = Config.url + options.url;
        this._params = {};
        if (options.hasOwnProperty("params")) {
            this._params = options.params;
        }
    };

    /**
     * Get request
     * @returns {Promise}
     */
    get() {
        let self = this;
        return new Promise(function (resolve, reject) {
            $.get(self._url, self._params).done(function (data) {
                resolve(data);
            }).catch(function (err) {
                throw new Error(err);
            });
        });
    };

    /**
     * Delete request
     * @returns {Promise}
     */
    delete() {
        let self = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "DELETE",
                url: self._url,
                params: self._params
            }).done(function (data) {
                resolve(data);
            }).catch(function (err) {
                throw new Error(err);
            });
        });
    };

    /**
     * Post request
     * @returns {Promise}
     */
    post() {
        let self = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: self._url,
                data: self._params
            }).done(function (data) {
                resolve(data);
            }).catch(function (err) {
                throw new Error(err);
            });
        });
    };

}

export default RemoteJQ;