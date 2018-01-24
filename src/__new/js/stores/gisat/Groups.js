define([
    '../BaseStore',
    '../Stores',
    '../../data/Group',

    'jquery'
], function(BaseStore,
            Stores,
            Group){
    "use strict";
    var groups;

    /**
     * Store for retrieval of groups from the API.
     * @augments BaseStore
     * @constructor
     * @alias Groups
     */
    var Groups = function() {
        BaseStore.apply(this, arguments);
    };

    Groups.prototype = Object.create(BaseStore.prototype);

    /**
     * @inheritDoc
     */
    Groups.prototype.getInstance = function(layerData) {
        return new Group({data: layerData});
    };

    /**
     * @inheritDoc
     */
    Groups.prototype.getPath = function() {
        return "rest/group";
    };

    /**
     * It shares current state of the application with a group. This means that the group will have access to all
     * permission protected parts of the application.
     * @param group {Number} Id of the group to share the data with
     * @param scope {Number} Id of the scope to share with the group
     * @param places {Number[]} Array of ids of places to share with the user.
     * @param dataviewId {Number} Id of the dataview
     */
    Groups.prototype.share = function(group, scope, places, dataviewId) {
        if(!group) {
            return Promise.resolve(null);
        }

        return $.post(Config.url + 'rest/share/group', {
			dataView: dataviewId,
            group: group,
            scope: scope,
            places: places
        });
    };

    if(!groups) {
        groups = new Groups();
        Stores.register('group', groups);
    }
    return groups;
});