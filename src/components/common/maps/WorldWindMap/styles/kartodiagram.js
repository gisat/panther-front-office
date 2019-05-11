import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';

const {Color, ShapeAttributes} = WorldWind;

const noDataColor = chroma('#ccc');

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getKartodiagramStyleFunction = (color, fillTransparency) => {

    //create 5 classes
    return (renderable, layer) => {

        if(renderable.radius) {
            //circle style
            let attributes = new ShapeAttributes();
            attributes.interiorColor = Color.colorFromByteArray([...chroma(color).rgb(), fillTransparency]);
            attributes.outlineColor = Color.colorFromByteArray([...chroma(color).darken(2).rgb(), 120]);
            return attributes;
        } else {
            // polygon style
            let attributes = new ShapeAttributes();
            attributes.interiorColor = Color.colorFromByteArray([...noDataColor.rgb(), 100]);
            attributes.outlineColor = Color.colorFromByteArray([...noDataColor.darken(2).rgb(), 120]);
            return attributes;
        }        
    }
}