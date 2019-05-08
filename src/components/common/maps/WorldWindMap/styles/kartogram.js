import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';
import {getValueClassesByStatistics, getClassByValue, getColorByValue} from '../../../../../utils/statistics'

const {Color, ShapeAttributes} = WorldWind;

const noDataColor = chroma('#ccc');

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getKartogramStyleFunction = (hue, fillTransparency, statistics, attributeDataKey) => {
    const classCount = 5;
    const colorScale = chroma.scale([chroma.hsl(hue, 1, .84), chroma.hsl(hue, 1, .35)]);
    const statisticsClasses = getValueClassesByStatistics(statistics, classCount);
    const colorClasses = colorScale.colors(classCount, null).map(c => c.saturate(1));
    

    //create 5 classes
    return (renderable, layer) => {
        let attributes = new ShapeAttributes();
        // const valueColor = getColorByValue(Number.parseInt(renderable.userProperties[attributeDataKey]), Number.parseInt(layer.attributeStatistics.min), Number.parseInt(layer.attributeStatistics.max), colorScale);
        // if(calassIndex > 1) {
        const value = renderable.userProperties[attributeDataKey];
        let valueColor;
        if(value){
            const calassIndex = getClassByValue(statisticsClasses, renderable.userProperties[attributeDataKey]);
            valueColor = colorClasses[calassIndex - 1];
        } else {
            valueColor = noDataColor;
        }

        attributes.interiorColor = Color.colorFromByteArray([...valueColor.rgb(), fillTransparency]);
        // attributes.outlineColor = Color.colorFromByteArray(240, 240, 240, 120); //gray
        attributes.outlineColor = Color.colorFromByteArray([...valueColor.darken(2).rgb(), 120]); //gray
        return attributes;
    }
}