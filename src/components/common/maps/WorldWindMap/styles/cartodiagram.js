import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';

import {
    DEFAULTFILLTRANSPARENCY,
    getOutlineColor,

    noDataAccentedPalette,
    filteredPalette,
    noDataPalette,
    hoverPalette
} from './colors'

const {Color, ShapeAttributes} = WorldWind;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getCartodiagramStyleFunction = (color = noDataPalette.colorRgb, fillTransparency = DEFAULTFILLTRANSPARENCY) => {

    const diagramInteriorColor = Color.colorFromByteArray([...chroma(color).rgb(), fillTransparency]);
    const diagramOutlineColor = Color.colorFromByteArray([...getOutlineColor(color)]);

    //create 5 classes
    return (renderable, layer) => {

        if(renderable.radius) {
            //circle style
            const attributes = new ShapeAttributes();

            if (renderable.hovered) {
                attributes.interiorColor = Color.colorFromByteArray(hoverPalette.colorOpaqueRgba);
                attributes.outlineColor = Color.colorFromByteArray(hoverPalette.darkerTransparentRgba);    
            } else if (renderable.filtered) {
                attributes.interiorColor = Color.colorFromByteArray(filteredPalette.colorTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);

            } else {
                attributes.interiorColor = diagramInteriorColor;
                attributes.outlineColor = diagramOutlineColor;
            }
            return attributes;
        } else {
            // polygon style
            const attributes = new ShapeAttributes();
            if (renderable.hovered) {
                attributes.interiorColor = Color.colorFromByteArray(hoverPalette.lighterTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(hoverPalette.colorTransparentRgba);    
            } else if(renderable.filtered === true) {
                attributes.interiorColor = Color.colorFromByteArray(filteredPalette.lighterTransparentRgba);
                attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
        
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