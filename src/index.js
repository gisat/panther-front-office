function createScript(src, dataMain) {
    return new Promise(function (resolve, reject) {
        var callback = function () {
            resolve();
        };
        var startupScript = document.createElement("script");
        startupScript.type = "text/javascript";
        startupScript.src = src;
        startupScript.async = 1;
        startupScript.onload = callback;
        document.getElementsByTagName('head')[0].appendChild(startupScript);
        if (dataMain) {
            document.getElementsByTagName('head')[0].lastChild.setAttribute("data-main", dataMain);
        }
    });
}
function createLink(href) {
    return new Promise(function (resolve, reject) {
        var callback = function () {
            resolve();
        };
        var startupScript = document.createElement("link");
        startupScript.type = "text/css";
        startupScript.async = 1;
        startupScript.href = href;
        startupScript.rel = 'stylesheet';
        startupScript.onload = callback;
        document.getElementsByTagName('head')[0].appendChild(startupScript);
    });
}
var configuration = Config.environment;
if (configuration == 'development') {
    createScript('lib/OpenLayers.min.js').then(function(){
        return createScript('gisatlib/OpenLayers/Geoserver23.js');
    }).then(function(){
        return createScript('extjs-4.1.3/ext-debug.js');
    }).then(function(){
        return createScript('appde.js');
    }).then(function(){
        if ((Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool) ||
            (Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap) ||
            (Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo) ||
            (Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies)){
            return createScript('__new/lib/require.js', '__new/app.js');
        }
    }).then(function(){
        // If printing hide wrong parts.
        if(window.location.toString().indexOf("print") != -1) {
            Config.exportPage = true;
            $('#main').hide();
            $('#loading-mask-shim').hide();
            $('#loading-mask').hide();
            $('#loading-screen').hide();
            $('body').removeClass('intro');
            $('body').css('background', 'none');
        } else {
            $('#rendering').hide();
            $('#legend').hide();
        }
    });
} else {
    createScript('lib/OpenLayers.min.js').then(function(){
        return createScript('extjs-4.1.3/ext.js');
    }).then(function(){
        return createScript('appde.all.js');
    }).then(function(){
        if ((Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool) ||
            (Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap) ||
            (Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo) ||
            (Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies)){
            return createScript('__new/app-built.js');
        }
    }).then(function(){
        // If printing hide wrong parts.
        if(window.location.toString().indexOf("print") != -1) {
            Config.exportPage = true;
            $('#main').hide();
            $('#loading-mask-shim').hide();
            $('#loading-mask').hide();
            $('#loading-screen').hide();
            $('body').removeClass('intro');
            $('body').css('background', 'none');
        } else {
            $('#rendering').hide();
            $('#legend').hide();
        }
    });
}
// load project styles depending on the toggles
if((Config.toggles.hasOwnProperty("hasNewEvaluationTool") && Config.toggles.hasNewEvaluationTool) ||
    (Config.toggles.hasOwnProperty("hasNewFeatureInfo") && Config.toggles.hasNewFeatureInfo) ||
    (Config.toggles.hasOwnProperty("hasNew3Dmap") && Config.toggles.hasNew3Dmap) ||
    (Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies))
{
    createLink("__new/styles/font-awesome.min.css");
    createLink("__new/styles/jquery-ui.css");
    createLink("__new/styles/style.css");
	createLink("__new/styles/select2.min.css");
}
if(Config.toggles.isNewDesign){
    createLink("css/newDesign.css");
}
if(Config.toggles.isUrbis){
    createLink("css/project/urbis.css");
}
if(Config.toggles.isEea){
    createLink("css/project/eea.css");
}
if(Config.toggles.isUrbanTep){
    createLink("__new/styles/urban-tep.css");
}
if(Config.toggles.hasOwnProperty("isMelodies") && Config.toggles.isMelodies){
    createLink("css/project/melodies.css");
}