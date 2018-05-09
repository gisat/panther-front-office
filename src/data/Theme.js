import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Theme extends Model {
    data() {
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            },
            dataset: {
                serverName: 'dataset'
            }
        };
    };
}

export default Theme;
