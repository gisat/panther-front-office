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
                serverName: '_id',
                transformToLocal: Number
            },
            name: {
                serverName: 'name'
            },
            theme: {
                serverName: 'theme',
                transformToLocal: Number
            },
            attributes: {
                serverName: 'attributes',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            },
            options: {
                serverName: 'options'
            }
        };
    };
}

export default Visualization;