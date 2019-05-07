import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';

const {Color, ShapeAttributes} = WorldWind;

const getColorByValue = (value, min, max, palette) => {
    return palette((value - min) / (max - min))
}

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getKartodiagramStyleFunction = (hue, fillTransparency, statistics, attributeDataKey) => {
    //classes
    // .luminance(.3)
    const colorScale = chroma.scale([chroma.hsl(hue, 1, .92), chroma.hsl(hue, 1, .14)]);
    return (renderable, layer) => {
        let attributes = new ShapeAttributes();
        const valueColor = getColorByValue(Number.parseInt(renderable.userProperties[attributeDataKey]), Number.parseInt(layer.attributeStatistics.min), Number.parseInt(layer.attributeStatistics.max), colorScale);
        attributes.interiorColor = Color.colorFromByteArray([...valueColor.rgb(), fillTransparency]);
        attributes.outlineColor = Color.colorFromByteArray(240, 240, 240, 120); //gray
        return attributes;
    }
}