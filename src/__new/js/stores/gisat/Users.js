define([
    '../BaseStore',
    '../../data/User'
], function(BaseStore,
            User){
    "use strict";

    /**
     * Store for retrieval of users from the API.
     * @augments BaseStore
     * @constructor
     * @alias Users
     */
    var Users = function() {
        BaseStore.apply(this, arguments);
    };

    Users.prototype = Object.create(BaseStore.prototype);

    /**
     * @inheritDoc
     */
    Users.prototype.getInstance = function(layerData) {
        return new User({data: layerData});
    };

    /**
     * @inheritDoc
     */
    Users.prototype.getPath = function() {
        return "rest/user";
    };

    /**
     * It shares current state of the application with a user. This means that the user will have access to all
     * permission protected parts of the application.
     * @param user {Number} Id of the user to share the data with
     * @param scope {Number} Id of the scope to share with the group
     * @param places {Number[]} Array of ids of places to share with the user.
     * @param dataviewId {Number} Id of the dataview
     */
    Users.prototype.share = function(user, scope, places, dataviewId) {
        if(!user) {
            return Promise.resolve(null);
        }

        return $.post(Config.url + 'rest/share/user', {
			dataView: dataviewId,
			user: user,
            scope: scope,
            places: places
        });
    };

    return Users;
});