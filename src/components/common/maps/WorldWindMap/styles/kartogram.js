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
export const getKartogramStyleFunction = (color, fillTransparency, statistics, attributeDataKey) => {
    const usePercentiles = statistics.hasOwnProperty('percentile') && statistics.percentile.length > 1;
    
    const classCount = usePercentiles ? statistics.percentile.length - 1 : 5;
    const chromaColor = chroma(color);
    const hsl = chromaColor.hsl();
    //take only hue from defined color
    const hue = hsl[0];
    const colorScale = chroma.scale([chroma.hsl(hue, 1, .84), chroma.hsl(hue, 1, .35)]);
    const statisticsClasses = statistics.percentile || getValueClassesByStatistics(statistics, classCount);
    const colorClasses = colorScale.colors(classCount, null).map(c => c.saturate(1));
    

    //create 5 classes
    return (renderable, layer) => {
        let attributes = new ShapeAttributes();
        // const valueColor = getColorByValue(Number.parseFloat(renderable.userProperties[attributeDataKey]), Number.parseFloat(layer.attributeStatistics.min), Number.parseFloat(layer.attributeStatistics.max), colorScale);
        // if(calassIndex > 1) {
        const value = renderable.userProperties[attributeDataKey];
        let valueColor;
        if(value || value === 0){
            const calassIndex = getClassByValue(statisticsClasses, renderable.userProperties[attributeDataKey]);
            valueColor = colorClasses[calassIndex];
        }

        if(!valueColor) {
            valueColor = noDataColor;
        }

        if (renderable.hovered) {
            attributes.interiorColor = Color.RED;
            attributes.outlineColor = Color.RED;
        } else if (renderable.filtered) {
            attributes.interiorColor = Color.colorFromByteArray([...noDataColor.rgb(), 100]);
            attributes.outlineColor = Color.colorFromByteArray([...noDataColor.darken(2).rgb(), 120]);
        } else {
            attributes.interiorColor = Color.colorFromByteArray([...valueColor.rgb(), fillTransparency]);
            attributes.outlineColor = Color.colorFromByteArray([...valueColor.darken(2).rgb(), 120]); //gray
        }

        return attributes;
    }
}