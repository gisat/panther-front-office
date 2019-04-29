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
            },
            identifier: {
                serverName: 'identifier'
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
			},
			users: {
				serverName: 'users'
			},
        };
    }
}

export default Group;