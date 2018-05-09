import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class User extends Model {
    data() {
        return {
            id: {
                serverName: '_id',
                transformToLocal: Number
            },
            name: {
                serverName: 'username'
            },
            email: {
                serverName: 'email'
            }
        };
    };
}

export default User;