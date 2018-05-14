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
                serverName: '_id',
                transformToLocal: Number
            },
            name: {
                serverName: 'name'
            },
            dataset: {
                serverName: 'dataset',
                transformToLocal: Number
            }
        };
    };
}

export default Theme;
