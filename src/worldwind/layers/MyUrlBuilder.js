import WorldWind from '@nasaworldwind/worldwind';
import proj4 from 'proj4';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';

let WmsUrlBuilder = WorldWind.WmsUrlBuilder;

/**
 * Class extending WorldWind.WmsLayer.
 * @augments WorldWind.WmsLayer
 * @constructor
 */
class MyUrlBuilder extends WmsUrlBuilder {
    constructor(serviceAddress, layerNames, styleNames, wmsVersion, timeString, sldId, customParams) {
        super(serviceAddress, layerNames, styleNames, wmsVersion, timeString);

        this.sldId = sldId;
        this.customParams = customParams;
        if(this.customParams && this.customParams.crs) {
            this.crs = this.customParams.crs;
        }
    };

    urlForTile(tile, imageFormat) {
        if (!tile) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile", "missingTile"));
        }
        if (!imageFormat) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile",
                    "The image format is null or undefined."));
        }
        let sector = tile.sector;
        let sb = WmsUrlBuilder.fixGetMapString(this.serviceAddress);
        if (sb.search(/service=wms/i) < 0) {
            sb = sb + "service=WMS";
        }
        sb = sb + "&request=GetMap";
        sb = sb + "&version=" + this.wmsVersion;
        sb = sb + "&transparent=" + (this.transparent ? "TRUE" : "FALSE");
        sb = sb + "&layers=" + this.layerNames;
        sb = sb + "&styles=" + this.styleNames;
        sb = sb + "&format=" + imageFormat;
        sb = sb + "&width=" + tile.tileWidth;
        sb = sb + "&height=" + tile.tileHeight;
        sb = sb + "&tiled=true";

        if (this.sldId){
            sb = sb + "&sld_id=" + this.sldId;
        }

        if (this.timeString) {
            sb = sb + "&time=" + this.timeString;
        }

        if (this.customParams){
            for (let key in this.customParams){
                if(key !== 'crs') {
                    sb = sb + "&" + key + "=" + this.customParams[key];
                }
            }
        }

        if (this.isWms130OrGreater) {
            sb = sb + "&crs=" + this.crs;
            sb = sb + "&bbox=";
            if (this.crs === "CRS:84") {
                sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
                sb = sb + sector.maxLongitude+ "," + sector.maxLatitude;
            } else if(this.crs === "EPSG:4326") {
                sb = sb + sector.minLatitude + "," + sector.minLongitude + ",";
                sb = sb + sector.maxLatitude+ "," + sector.maxLongitude;
            } else {
                sb = this.transform(sb, sector)
            }
        } else {
            sb = sb + "&srs=" + this.crs;
            if(this.crs === "EPSG:4326") {
                sb = sb + "&bbox=";
                sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
                sb = sb + sector.maxLongitude + "," + sector.maxLatitude;
            } else {
                sb = this.transform(sb, sector)
            }
        }

        sb = sb.replace(" ", "%20");
        return sb;
    };

    transform(sb, sector) {
        let source = new proj4.Proj('EPSG:4326');
        let dest = new proj4.Proj(this.crs);

        let southWestOld = new proj4.Point( sector.minLongitude, sector.minLatitude );
        let northEastOld = new proj4.Point( sector.maxLongitude, sector.maxLatitude );

        let southWestNew = proj4.transform(source, dest, southWestOld);
        let northEastNew = proj4.transform(source, dest, northEastOld);

        sb = sb + "&bbox=";
        sb = sb + southWestNew.x + "," + southWestNew.y + ",";
        sb = sb + northEastNew.x+ "," + northEastNew.y;

        return sb
    }
}

export default MyUrlBuilder;