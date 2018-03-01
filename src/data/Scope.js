import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Scope extends Model {
    data() {
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            },
            periods: {
                serverName: 'years'
            }
        };
    };

}

export default Scope;
