define([], function(){
    var GeoServer = function() {

    };

    GeoServer.prototype.login = function() {
        $.ajax({
            type: "POST",
            url: Config.geoServerLoginUrl,
            data: {
                username: Config.geoServerUser,
                password: Config.geoServerPassword
            }
        }).done(function (res) {
            var loginInfo = $(res).find('.username').text();
            var isLogged = loginInfo.slice(0, 6) === "Logged";
            if (isLogged) {
                console.log("GEOSERVER AUTHENTICATION: Authentication was successful")
            } else {
                console.error("GEOSERVER AUTHENTICATION: Authentication failed!");
            }
        }).fail(function (err) {
            console.error("GEOSERVER AUTHENTICATION: Authentication failed: " + err);
        });
    };

    return GeoServer;
});