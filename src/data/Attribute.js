import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Attribute extends Model {
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
            type: {
                serverName: 'type'
            },
            standardUnits: {
                serverName: 'standardUnits'
            },
            units: {
                serverName: 'units'
            },
            color: {
                serverName: 'color'
            }
        };
    };
}

export default Attribute;