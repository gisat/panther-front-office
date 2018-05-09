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
                serverName: '_id'
            },
            active: {
                serverName: 'active'
            },
            created: {
                serverName: 'created'
            },
            createdBy: {
                serverName: 'createdBy'
            },
            changed: {
                serverName: 'changed'
            },
            changedBy: {
                serverName: 'changedBy'
            },
            name: {
                serverName: 'name'
            },
            attributes: {
                serverName: 'attributes'
            },
            topic: {
                serverName: 'topic'
            },
            featureLayers: {
                serverName: 'featureLayers'
            }
        };
    };
}

export default AttributeSet;