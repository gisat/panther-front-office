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

            if(renderable.filtered === true) {
                attributes.interiorColor = Color.colorFromByteArray([...noDataColor.rgb(), 100]);
                attributes.outlineColor = Color.colorFromByteArray([...noDataColor.darken(2).rgb(), 120]);
            } else if (renderable.filtered === false || renderable.filtered == null) {
                attributes.interiorColor = Color.colorFromByteArray([...chroma(color).rgb(), fillTransparency]);
                attributes.outlineColor = Color.colorFromByteArray([...chroma(color).darken(2).rgb(), 120]);
            }
            return attributes;
        } else {
            // polygon style
            let attributes = new ShapeAttributes();
            if(renderable.filtered === true) {
                attributes.interiorColor = Color.colorFromByteArray([...noDataColor.brighten(.5).rgb(), 100]);
                attributes.outlineColor = Color.colorFromByteArray([...noDataColor.darken(1).rgb(), 120]);
            } else if (renderable.filtered === false) {
                attributes.interiorColor = Color.colorFromByteArray([...noDataColor.darken(.5).rgb(), 100]);
                attributes.outlineColor = Color.colorFromByteArray([...noDataColor.darken(2.5).rgb(), 120]);
            } else {
                attributes.interiorColor = Color.colorFromByteArray([...noDataColor.rgb(), 100]);
                attributes.outlineColor = Color.colorFromByteArray([...noDataColor.darken(2).rgb(), 120]);
            }
            return attributes;
        }        
    }
}