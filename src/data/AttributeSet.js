import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class AttributeSet extends Model {
    data() {
        return {
            id: {
                serverName: '_id',
                transformToLocal: Number
            },
            active: {
                serverName: 'active'
            },
            name: {
                serverName: 'name'
            },
            attributes: {
                serverName: 'attributes',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            },
            topic: {
                serverName: 'topic',
                transformToLocal: Number
            },
            featureLayers: {
                serverName: 'featureLayers',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            }
        };
    };
}

export default AttributeSet;