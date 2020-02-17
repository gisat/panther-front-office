import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';
import {getRadius} from '../layers/utils/diagram';
import {statistics as pantherStatistics} from "panther-utils";
import {
    DEFAULTFILLTRANSPARENCY,
    getOutlineColor,

    noDataAccentedPalette,
    filteredPalette,
    noDataPalette,
    hoverPalette
} from './colors'

const {Color, ShapeAttributes} = WorldWind;

export const MIN_DIAGRAM_RADIUS = 5000;
export const MAX_DIAGRAM_RADIUS = 80000;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getCartodiagramStyleFunction = (color = noDataPalette.colorRgb, fillTransparency = DEFAULTFILLTRANSPARENCY, statistics, attributeDataKey, series = 'volume', normalized = true, normalizedMaxRadius = MAX_DIAGRAM_RADIUS, normalizedMinRadius = MIN_DIAGRAM_RADIUS) => {

    const diagramInteriorColor = Color.colorFromByteArray([...chroma(color).rgb(), fillTransparency]);
    const diagramOutlineColor = Color.colorFromByteArray([...getOutlineColor(color)]);
    const normalizationCallback = normalized ? pantherStatistics.rangeMap([getRadius(statistics.min, series), getRadius(statistics.max, series)], [normalizedMinRadius, normalizedMaxRadius]) : null;

    //create 5 classes
    return (renderable, layer) => {

        if(renderable.radius || renderable.radius === 0) {
            //recalculate radius
            const value = renderable.userProperties[attributeDataKey];

            const radius = getRadius(value, series, normalizationCallback);
            renderable.radius = radius;

            if(radius && !renderable.enabled) {
                renderable.enabled = true;
            }

            //circle style
            const attributes = new ShapeAttributes();

            if (renderable.filtered) {
                attributes.interiorColor = Color.colorFromByteArray(filteredPalette.colorTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
            } else if (renderable.hovered) {
                attributes.interiorColor = Color.colorFromByteArray(hoverPalette.colorOpaqueRgba);
                attributes.outlineColor = Color.colorFromByteArray(hoverPalette.darkerTransparentRgba);    
            } else {
                attributes.interiorColor = diagramInteriorColor;
                attributes.outlineColor = diagramOutlineColor;
            }
            return attributes;
        } else {
            // polygon style
            const attributes = new ShapeAttributes();
            if(renderable.filtered === true) {
                attributes.interiorColor = Color.colorFromByteArray(filteredPalette.lighterTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
            } else if (renderable.hovered) {
                attributes.interiorColor = Color.colorFromByteArray(hoverPalette.lighterTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(hoverPalette.colorTransparentRgba);    
            } else if (renderable.accented === true) {
                attributes.interiorColor = Color.colorFromByteArray(noDataAccentedPalette.colorTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(noDataAccentedPalette.darkerTransparentRgba);
            } else {
                attributes.interiorColor = Color.colorFromByteArray(noDataPalette.colorTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(noDataPalette.darkerTransparentRgba);
            }
            return attributes;
        }        
    }
}