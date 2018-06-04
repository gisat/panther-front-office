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
            },
            groups: {
                serverName: 'groups'
            },
			permissions: {
				serverName: 'permissions'
			},
			permissionsGroups: {
				serverName: 'permissionsGroups'
			},
			permissionsTowards: {
				serverName: 'permissionsTowards'
			},
			permissionsUsers: {
				serverName: 'permissionsUsers'
			}
        };
    };
}

export default User;