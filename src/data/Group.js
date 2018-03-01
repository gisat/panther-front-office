import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Group extends Model {
    data() {
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            }
        };
    }
}

export default Group;