import WorldWind from '@nasaworldwind/worldwind';

import RemoteJQ from '../../util/RemoteJQ';
import MyUrlBuilder from './MyUrlBuilder';
import Cache from "../Cache";

let WmsLayer = WorldWind.WmsLayer;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @augments WorldWind.WmsLayer
 * @constructor
 */
class MyWmsLayer extends WmsLayer {
    constructor(options) {
        super(options);

        this.sldId = options.sldId;
        this.customParams = options.customParams;

        let cachePath = options.service + "/" + options.layerNames;
        if (this.sldId) {
            cachePath += "/" + this.sldId;
        }
        if (options.styleNames){
            cachePath += "/" + options.styleNames;
        }
        if (this.customParams) {
            if (this.customParams.time) {
                cachePath += "/" + this.customParams.time;
            }
        }
        if(options.name) {
            cachePath += "/" + options.name;
        }
        this.cachePath = cachePath;

        if (options.opacity) {
            this.opacity = options.opacity;
        }
        this.urlBuilder = new MyUrlBuilder(
            options.service, options.layerNames, options.styleNames, options.version,
            options.timeString, this.sldId, options.customParams);
    };

    /**
     * Execute the WMS GetFeatureInfo request
     * TODO working for EPSG:4326 only
     * @param property {string} name of property to find
     * @param coordinates {Object} point coordinates in lat, lon
     * @param layers {string}
     */
    getFeatureInfo(property, coordinates, layers) {
        let bottomLeft = (coordinates.lat - 0.01) + "," + (coordinates.lon - 0.01);
        let topRight = (coordinates.lat + 0.01) + "," + (coordinates.lon + 0.01);
        let bbox = bottomLeft + "," + topRight;

        return new RemoteJQ({
            url: "api/proxy/wms",
            params: {
                "SERVICE": "WMS",
                "VERSION": this.urlBuilder.wmsVersion,
                "REQUEST": "GetFeatureInfo",
                "LAYERS": layers,
                "QUERY_LAYERS": layers,
                "BBOX": bbox,
                "WIDTH": 2000,
                "HEIGHT": 2000,
                "CRS": this.urlBuilder.crs,
                "X": 1000,
                "Y": 1000,
                "PROPERTYNAME": property,
                "EXPECTJSON": true
            }
        }).get().then(function (results) {
            let feature = null;
            if (results && results.features && results.features.length > 0) {
                feature = results.features[0];
            }
            return feature;
        });
    };
}

export default MyWmsLayer;