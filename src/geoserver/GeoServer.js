

let Config = window.Config;

let $ = window.$;
class GeoServer {
    login() {
        return $.ajax({
            type: "POST",
            url: Config.geoServerLoginUrl,
            data: {
                username: Config.geoServerUser,
                password: Config.geoServerPassword
            }
        }).done(function (res) {
            let loginInfo = $(res).find('.username').text();
            let isLogged = loginInfo.slice(0, 6) === "Logged";
            if (isLogged) {
                console.log("GEOSERVER AUTHENTICATION: Authentication was successful")
            } else {
                console.error("GEOSERVER AUTHENTICATION: Authentication failed!");
            }
        }).fail(function (err) {
            console.error("GEOSERVER AUTHENTICATION: Authentication failed: " + err);
        });
    };
}

export default GeoServer;