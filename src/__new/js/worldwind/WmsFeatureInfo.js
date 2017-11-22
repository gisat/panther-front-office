define([
    './WmsFeatureInfoUrlBuilder',

    'jquery'
], function(WmsFeatureInfoUrlBuilder,

            $){
    /**
     * It handles retrieval of information from WMS endpoint about the current layers.
     * @constructor
     * @param options {Object}
     * @param options.serviceAddress {String} URL of the service to ask
     * @param options.position {Position} Position of the request.
     * @param options.layers {String} List of layers deliminated by , to request info about the location.
     * @param options.customParameters {Object} Optional Object containing custom parameters to be appended to the URL.
     * @param options.srs {String} Optional Coordinate system reference.
     */
    var WmsFeatureInfo = function(options) {
        this.options = options;

        this.urlBuilder = new WmsFeatureInfoUrlBuilder(options);
    };

    /**
     * Return just the retrieved table from the HTML based on the Result of the Information.
     * @returns {*}
     */
    WmsFeatureInfo.prototype.html = function() {
        return $.get(this.urlBuilder.url()).then(function(result){
            var el = document.createElement('div');
            el.innerHTML = result;

            return $(el).html();
        });
    };

    return WmsFeatureInfo;
});