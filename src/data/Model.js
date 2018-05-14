import _ from 'underscore';

/**
 * It returns promise of this model.
 * @constructor
 */
class Model {
    constructor(options) {
        return this.resolve(options.data);
    };


    /**
     * Prepare promise for all the properties, which are actual domain objects.
     * @param data Object with data from the API.
     */
    resolve(data) {
        let self = this;
        let promises = [];
        _.each(self.data(), function (value, key) {
            let internalKey = key;
            if (value.isPromise) {
                if (value.isArray) {
                    self[internalKey] = value.transform({id: data[value.serverName]});
                } else {
                    self[internalKey] = value.transform(data[value.serverName]);
                }

                promises.push(self[internalKey]);
            } else {
                if (value.transform && value.all) {
                    self[internalKey] = value.transform(data);
                } else if (value.transform) {
                    self[internalKey] = value.transform(data[value.serverName]);
                } else {
                    self[internalKey] = data[value.serverName];
                }
            }
        });

        return Promise.all(promises).then(() => {
            return self;
        });
    };
}

export default Model;