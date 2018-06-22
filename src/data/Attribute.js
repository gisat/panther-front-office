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
                serverName: '_id',
                transformToLocal: Number
            },
            active: {
                serverName: 'active'
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
            },
            columnName: {
                serverName: 'columnName'
            },
            enumerationValues: {
                serverName: 'enumerationValues'
            }
        };
    };
}

export default Attribute;