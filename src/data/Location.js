import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Location extends Model {
    data() {
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            },
            bbox: {
                serverName: 'bbox'
            },
            dataset: {
                serverName: 'dataset'
            }
        };
    };
}

export default Location;