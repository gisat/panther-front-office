import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Dataview extends Model {
    data() {
        return {
            id: {
                serverName: '_id',
                transformToLocal: Number
            },
            data: {
                serverName: 'conf'
            },
            date: {
                serverName: 'changed'
            }
        };
    };

}

export default Dataview;