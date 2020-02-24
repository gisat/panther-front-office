import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';
import {getRadius} from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/utils/diagram';
import {rangeMap} from '../../../../../utils/statistics';
import {
    DEFAULTFILLTRANSPARENCY,
    getOutlineColor,

    noDataAccentedPalette,
    filteredPalette,
    noDataPalette,
    hoverPalette,
    getColorPallet
} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'

const {Color, ShapeAttributes} = WorldWind;

export const MIN_DIAGRAM_RADIUS = 5000;
export const MAX_DIAGRAM_RADIUS = 80000;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getCartodiagramStyleFunction = (fillColor, fillTransparency, outlinesColor, outlinesTransparency, attributeDataKey, series = 'volume') => {

    // const diagramInteriorColor = Color.colorFromByteArray([...chroma(color).rgb(), fillTransparency]);
    // const diagramOutlineColor = Color.colorFromByteArray([...getOutlineColor(color)]);
    const interiorColor = Color.colorFromByteArray([...chroma(fillColor).rgb(), fillTransparency]);
    const outlineColor = Color.colorFromByteArray([...chroma(outlinesColor).rgb(), outlinesTransparency]);
    const normalizationCallback = null;

    const greenPallete = getColorPallet('#4caf50');
    
    const ctxImg = `rgba(${greenPallete.lighterRgb.join(',')},0.5)`;
    const ctxImgHovered = `rgba(${hoverPalette.lighterRgb.join(',')},0.5)`;
    const ctxImgSelected = `rgba(${greenPallete.darkerRgb.join(',')},0.7)`;

    //create 5 classes
    return (renderable, layer) => {
        // if(renderable.userPrerties.perimeter || renderable.userPrerties.perimeter === 0) {
        if(true) {
            
        
            //recalculate radius
            const value = renderable.userProperties[attributeDataKey];

            const radius = getRadius((value/Math.PI)/2, series, normalizationCallback);
            renderable.radius = radius;

            if(radius && !renderable.enabled) {
                renderable.enabled = true;
            }

            //circle style
            const attributes = new ShapeAttributes();

            // if (renderable.filtered) {
            //     attributes.interiorColor = Color.colorFromByteArray(filteredPalette.colorTransparentRgba);
            //     attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
            // } else if (renderable.hovered) {
            //     attributes.interiorColor = Color.colorFromByteArray(hoverPalette.colorOpaqueRgba);
            //     attributes.outlineColor = Color.colorFromByteArray(hoverPalette.darkerTransparentRgba);    
            // } else {
            //     attributes.interiorColor = diagramInteriorColor;
            //     attributes.outlineColor = diagramOutlineColor;
            // }

            if(renderable.filtered === true) {
                attributes.interiorColor = Color.colorFromByteArray(filteredPalette.lighterTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
            } else if (renderable.selected) {
                attributes.interiorColor = Color.colorFromByteArray([...greenPallete.darkerRgb, 178,5]);
                attributes.outlineColor = outlineColor;
            } else if (renderable.hovered) {
                attributes.interiorColor = Color.colorFromByteArray([...hoverPalette.lighterRgb, 127,5]);
                attributes.outlineColor = Color.colorFromByteArray(hoverPalette.colorTransparentRgba);    
            } else if (renderable.accented === true) {
                attributes.interiorColor = Color.colorFromByteArray(noDataAccentedPalette.colorTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(noDataAccentedPalette.darkerTransparentRgba);
            } else {
                attributes.interiorColor = Color.colorFromByteArray([...greenPallete.lighterRgb, 127,5]);
                attributes.outlineColor = outlineColor;
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