import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Period extends Model {
    data() {
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            },
            period: {
                serverName: 'period'
            }
        };
    };
}


export default Period;