import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Visualization extends Model {
    data() {
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            },
            theme: {
                serverName: 'theme'
            },
            attributes: {
                serverName: 'attributes'
            },
            options: {
                serverName: 'options'
            }
        };
    };
}

export default Visualization;