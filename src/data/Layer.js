import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Layer extends Model {
    data() {
        return {
            name: {
                serverName: 'name'
            },
            path: {
                serverName: 'path'
            },
            referenced: {
                serverName: 'referenced'
            },
            source: {
                serverName: 'source'
            }
        };
    };
}

export default Layer;