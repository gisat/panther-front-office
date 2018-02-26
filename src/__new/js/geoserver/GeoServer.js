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
            $('body').append('<div id="geoserver-login"></div>');
            var geoserverEl = $('#geoserver-login');
            geoserverEl.html(res);
            var loginInfo = geoserverEl.find('.username').text();
            var isLogged = loginInfo.slice(0, 6) === "Logged";
            if (isLogged) {
                console.log("GEOSERVER AUTHENTICATION: Authentication was successful")
            } else {
                console.error("GEOSERVER AUTHENTICATION: Authentication failed!");
            }
            var element = document.getElementById('geoserver-login');
            element.remove();
        }).fail(function (err) {
            console.error("GEOSERVER AUTHENTICATION: Authentication failed: " + err);
        });
    };

    return GeoServer;
});