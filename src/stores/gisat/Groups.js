import BaseStore from '../BaseStore';
import Group from '../../data/Group';


let Config = window.Config;

/**
 * Store for retrieval of groups from the API.
 * @augments BaseStore
 * @constructor
 * @alias Groups
 */
let $ = window.$;
class Groups extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(layerData) {
        return new Group({data: layerData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/group";
    }

    /**
     * It shares current state of the application with a group. This means that the group will have access to all
     * permission protected parts of the application.
     * @param group {Number} Id of the group to share the data with
     * @param scope {Number} Id of the scope to share with the group
     * @param places {Number[]} Array of ids of places to share with the user.
     * @param dataviewId {Number} Id of the dataview
     */
    share(group, scope, places, dataviewId) {
        if (!group) {
            return Promise.resolve(null);
        }

        return $.post(Config.url + 'rest/share/group', {
            dataView: dataviewId,
            group: group,
            scope: scope,
            places: places
        });
    }
}

export default Groups;