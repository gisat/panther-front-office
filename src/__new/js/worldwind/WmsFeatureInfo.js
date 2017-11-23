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
     * @param options.screenCoordiantes {Object} Coordinates of click event
     */
    var WmsFeatureInfo = function(options) {
        this.options = options;
        this.urlBuilder = new WmsFeatureInfoUrlBuilder(options);
    };

    /**
     * Return result of get feature info request with request options
     * @returns {Object}
     */
    WmsFeatureInfo.prototype.get = function() {
        var self = this;
        return $.get(this.urlBuilder.url()).then(function(result){
            return {
                featureInfo: result,
                options: self.options
            };
        });
    };

    return WmsFeatureInfo;
});