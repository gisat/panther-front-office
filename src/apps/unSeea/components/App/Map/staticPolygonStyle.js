import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';

import {
    DEFAULTFILLTRANSPARENCY,
    getOutlineColor,

    noDataAccentedPalette,
    filteredPalette,
    noDataPalette,
    hoverPalette
} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'

const {Color, ShapeAttributes} = WorldWind;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getStaticDistrictsStyleFunction = (fillColor, fillTransparency, outlinesColor, outlinesTransparency, outlinesWidth) => {

    const interiorColor = Color.colorFromByteArray([...chroma(fillColor).rgb(), fillTransparency]);
    const outlineColor = Color.colorFromByteArray([...chroma(outlinesColor).rgb(), outlinesTransparency]);

    //create 5 classes
    return (renderable, layer) => {
        // polygon style
        const attributes = new ShapeAttributes();
        if(renderable.filtered === true) {
            attributes.interiorColor = Color.colorFromByteArray(filteredPalette.lighterTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
        } else if (renderable.selected) {
            attributes.interiorColor = Color.colorFromByteArray([62, 103, 182, 180]);
            attributes.outlineColor = Color.colorFromByteArray([44, 82, 154, 255]);    
        } else if (renderable.hovered) {
            attributes.interiorColor = Color.colorFromByteArray(hoverPalette.lighterTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(hoverPalette.colorTransparentRgba);    
        } else if (renderable.accented === true) {
            attributes.interiorColor = Color.colorFromByteArray(noDataAccentedPalette.colorTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(noDataAccentedPalette.darkerTransparentRgba);
        } else {
            attributes.interiorColor = interiorColor;
            attributes.outlineColor = outlineColor;
        }
        return attributes;  
    }
}