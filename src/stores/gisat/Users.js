

import BaseStore from '../BaseStore';
import User from '../../data/User';

let Config = window.Config;

let $ = window.$;
class Users extends BaseStore {
    /**
     * @inheritDoc
     */
    getInstance(userData) {
        return new User({data: userData});
    }

    /**
     * @inheritDoc
     */
    getPath() {
        return "rest/user";
    }

    /**
     * It shares current state of the application with a user. This means that the user will have access to all
     * permission protected parts of the application.
     * @param user {Number} Id of the user to share the data with
     * @param scope {Number} Id of the scope to share with the group
     * @param places {Number[]} Array of ids of places to share with the user.
     * @param dataviewId {Number} Id of the dataview
     */
    share(user, scope, places, dataviewId) {
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
}

export default Users;