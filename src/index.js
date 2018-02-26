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
    createScript('//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js').then(function(){
        jQuery(document).ready(function(){
            $('#header>h1').text(polyglot.t('dataExploration'));
            $('#header .menu #intro-link a').text(polyglot.t('introduction'));
            $('#header .menu #downloads-link a').text(polyglot.t('downloads'));
            $('#header .menu #help-link a').text(polyglot.t('help'));
            $('#header .menu #bo-link a').text(polyglot.t('administration'));
            $('#header .user .login').text(polyglot.t('login'));
            $('#header .user .signup').text(polyglot.t('signUp'));
            $('#content #content-intro>div.label').text(polyglot.t('dataExploration'));
            $('#content #content-intro .scope .label').text(polyglot.t('scope'));
            $('#content #content-intro .place .label').text(polyglot.t('place'));
            $('#content #content-intro .theme .label').text(polyglot.t('theme'));
            $('#content #content-intro-guide').html(polyglot.t('selectionGuide'));
            $('#content #content-application .scope .label').text(polyglot.t('scope'));
            $('#content #content-application .place .label').text(polyglot.t('place'));
            $('#content #content-application .theme .label').text(polyglot.t('theme'));
			$('#content #content-application .period .label').text(polyglot.t('year'));
			$('#content #content-application .visualization .label').text(polyglot.t('visualization'));
            $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-snapshot').attr('title', polyglot.t('takeMapSnapshot'));
            $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-share-view').attr('title', polyglot.t('shareView'));
            $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-context-help').attr('title', polyglot.t('contextHelp'));
            $('#content #content-application #sidebar-tools #sidebar-tools-toggle').attr('title', polyglot.t('tools'));
            $('#content #content-application #sidebar-reports #sidebar-reports-toggle').attr('title', polyglot.t('reports'));
        });

        return createScript('lib/OpenLayers.min.js');
    }).then(function(){
        return createScript('gisatlib/OpenLayers/Geoserver23.js');
    }).then(function(){
        return createScript('lib/Highcharts-3.0.0/js/highcharts.src.js');
    }).then(function(){
        return createScript('lib/Highcharts-3.0.0/js/highcharts-more.js');
    }).then(function(){
        return createScript('lib/Highcharts-3.0.0/js/modules/exporting.js');
    }).then(function(){
        return createScript('extjs-4.1.3/ext.js');
    }).then(function(){
		var urlLang = new URL(window.location).searchParams.get('lang');
        if(urlLang == "cz") {
			return createScript('extjs-4.1.3/locale/ext-lang-cs.js');
		}
	}).then(function(){
        return createScript('__new/lib/require.js', '__new/app.js');
    });
} else {
    var version = '';
    createScript('//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js').then(function() {
        jQuery(document).ready(function(){
            $('#header>h1').text(polyglot.t('dataExploration'));
            $('#header .menu #intro-link a').text(polyglot.t('introduction'));
            $('#header .menu #downloads-link a').text(polyglot.t('downloads'));
            $('#header .menu #help-link a').text(polyglot.t('help'));
            $('#header .menu #bo-link a').text(polyglot.t('administration'));
            $('#header .user .login').text(polyglot.t('login'));
            $('#header .user .signup').text(polyglot.t('signUp'));
            $('#content #content-intro>div.label').text(polyglot.t('dataExploration'));
            $('#content #content-intro .scope .label').text(polyglot.t('scope'));
            $('#content #content-intro .place .label').text(polyglot.t('place'));
            $('#content #content-intro .theme .label').text(polyglot.t('theme'));
            $('#content #content-intro-guide').html(polyglot.t('selectionGuide'));
            $('#content #content-application .scope .label').text(polyglot.t('scope'));
            $('#content #content-application .place .label').text(polyglot.t('place'));
            $('#content #content-application .theme .label').text(polyglot.t('theme'));
			$('#content #content-application .period .label').text(polyglot.t('year'));
            $('#content #content-application .visualization .label').text(polyglot.t('visualization'));
            $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-snapshot').attr('title', polyglot.t('takeMapSnapshot'));
            $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-share-view').attr('title', polyglot.t('shareView'));
            $('#content #content-application #top-toolbar #top-toolbar-tools #top-toolbar-context-help').attr('title', polyglot.t('contextHelp'));
            $('#content #content-application #sidebar-tools #sidebar-tools-toggle').attr('title', polyglot.t('tools'));
            $('#content #content-application #sidebar-reports #sidebar-reports-toggle').attr('title', polyglot.t('reports'));
        });

        return jQuery.get(Config.url + 'rest/fo/version');
    }).then(function(result){
        if(result.status === 'ok') {
            version = result.version;
        } else {
            alert('There was an issue with retrieving version of the application. It is possible that the cached version will be used.')
        }

        return createScript('lib/OpenLayers.min.js');
    }).then(function(){
        return createScript('gisatlib/OpenLayers/Geoserver23.js');
    }).then(function(){
        return createScript('lib/Highcharts-3.0.0/js/highcharts.src.js');
    }).then(function(){
        return createScript('lib/Highcharts-3.0.0/js/highcharts-more.js');
    }).then(function(){
        return createScript('lib/Highcharts-3.0.0/js/modules/exporting.js');
    }).then(function(){
        return createScript('extjs-4.1.3/ext.js');
    }).then(function(){
		var urlLang = new URL(window.location).searchParams.get('lang');
		if(urlLang == "cz") {
			return createScript('extjs-4.1.3/locale/ext-lang-cs.js');
		}
	}).then(function(){
        return createScript('__new/app-built.js?version=' + version);
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
	createLink("__new/styles/projects.css");
}