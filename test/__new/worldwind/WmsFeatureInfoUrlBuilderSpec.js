define([
    'src/__new/js/error/ArgumentError',
    'src/__new/js/worldwind/WmsFeatureInfoUrlBuilder'
], function (ArgumentError,
             WmsFeatureInfoUrlBuilder) {
    "use strict";

    describe('Generate URL', function () {
        describe('When the service address is empty', function () {
            it("Then throws Exception", function () {
                expect(function () {
                    return new WmsFeatureInfoUrlBuilder({})
                }).toThrow(new ArgumentError("WmsFeatureInfoUrlBuilder#constructor Service Address wasn't provided"));
            });
        });

        describe('When the layers is empty', function () {
            it("Then throws Exception", function () {
                expect(function () {
                    return new WmsFeatureInfoUrlBuilder({
                        serviceAddress: 'someAddress'
                    })
                }).toThrow(new ArgumentError("WmsFeatureInfoUrlBuilder#constructor Layers wasn't provided"));
            });
        });

        describe('When the position is empty', function () {
            it("Then throws Exception", function () {
                expect(function () {
                    return new WmsFeatureInfoUrlBuilder({
                        serviceAddress: 'someAddress',
                        layers: 'validLayer'
                    })
                }).toThrow(new ArgumentError("WmsFeatureInfoUrlBuilder#constructor Position wasn't provided"));
            });
        });

        describe('When only the required parameters are passed', function(){
            it('Then returns the URL with optional parameters filled with defaults.', function(){
                var result = new WmsFeatureInfoUrlBuilder({
                    serviceAddress: 'someAddress',
                    layers: 'validLayer',
                    position: {
                        latitude: 19.56,
                        longitude: 10.45
                    }
                }).url();

                var expected = 'someAddress?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=1.1.1&TRANSPARENT=TRUE&LAYERS=validLayer&' +
                    'STYLES=&FORMAT=image/png&WIDTH=256&HEIGHT=256&SRS=EPSG:4326&INFO_FORMAT=text/html&QUERY_LAYERS=validLayer&X=0&Y=0&' +
                    'BBOX=19.56,10.45,19.560001,10.450000999999999';
                expect(result).toBe(expected);
            });
        });

        describe('When all parameters are passed', function(){
            it('Then returns the URL wih all the optional parameters as provided', function() {
                var result = new WmsFeatureInfoUrlBuilder({
                    serviceAddress: 'someAddress',
                    layers: 'validLayer',
                    position: {
                        latitude: 19.56,
                        longitude: 10.45
                    },
                    infoFormat: 'application/json',
                    customParameters: {
                        time: '2017-06-11',
                        showLogo: false
                    },
                    srs: 'EPSG:900913',
                    version: '2.0.0'
                }).url();

                console.log(result);

                var expected = 'someAddress?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=2.0.0&TRANSPARENT=TRUE&LAYERS=validLayer&' +
                    'STYLES=&FORMAT=image/png&WIDTH=256&HEIGHT=256&SRS=EPSG:900913&INFO_FORMAT=application/json&QUERY_LAYERS=validLayer&' +
                    'X=0&Y=0&BBOX=19.56,10.45,19.560001,10.450000999999999&time=2017-06-11&showLogo=false';
                expect(result).toBe(expected);
            });
        })
    });
});