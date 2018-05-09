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
                serverName: '_id',
                transformToLocal: Number
            },
            name: {
                serverName: 'name'
            }
        };
    }
}

export default Group;