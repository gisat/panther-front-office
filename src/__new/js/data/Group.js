define(['./Model'], function(Model){
    /**
     * @augments Model
     * @param options
     * @constructor
     */
    var Group = function(options) {
        Model.apply(this, arguments);
    };

    Group.prototype = Object.create(Model.prototype);

    Group.prototype.data = function(){
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'name'
            }
        };
    };

    return Group;
});