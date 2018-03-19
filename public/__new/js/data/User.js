define(['./Model'], function(Model){
    /**
     * @augments Model
     * @param options
     * @constructor
     */
    var User = function(options) {
        Model.apply(this, arguments);
    };

    User.prototype = Object.create(Model.prototype);

    User.prototype.data = function(){
        return {
            id: {
                serverName: '_id'
            },
            name: {
                serverName: 'username'
            },
            email: {
                serverName: 'email'
            }
        };
    };

    return User;
});