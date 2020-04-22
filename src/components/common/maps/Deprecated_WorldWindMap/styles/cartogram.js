import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';
import {getValueClassesByStatistics, getClassByValue, getClassCount, setClassesMinMaxFromStatistics, getMinMaxCenterValueClassesByStatistics, getLogClassesByStatistics, getLogClassByValue} from '../../../../../utils/statistics'
import {
    DEFAULTFILLTRANSPARENCY,
    DEFAULTOUTLINETRANSPARENCY,
    getCartogramColorScale,
    getCartogramTwoColorScale,
    transformScaleDarker,

    filteredPalette,
    noDataPalette,
    hoverPalette,
} from './colors'

const {Color, ShapeAttributes} = WorldWind;

export const useLogScale = true;
/**
 * 
 * @param {string} highColor  
 * @param {string} lowColor  
 * @param {string} centerColor  
 * @param {Array} classCount  number of classes
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 * @param {Object} statistics Object with min, max, optionaly center
 * @param {string} attributeDataKey
 */
export const getTwoColoredCartogramStyleFunction = (highColor, lowColor, centerColor, classCount, fillTransparency = DEFAULTFILLTRANSPARENCY, statistics, attributeDataKey) => {
    let statisticsClasses;
    if(useLogScale) {
        statisticsClasses = getLogClassesByStatistics(statistics, classCount);
    } else {
        statisticsClasses = getMinMaxCenterValueClassesByStatistics(statistics, classCount);
    }
    
    const colorByteArrayClasses = getCartogramTwoColorScale(highColor, lowColor, centerColor, classCount);
    const colorClasses = colorByteArrayClasses.map((c) => Color.colorFromByteArray([...c, fillTransparency]));
    
    const outlineColorByteArrayClasses = transformScaleDarker(colorByteArrayClasses, 2);
    const outlineColorClasses = outlineColorByteArrayClasses.map((c) => Color.colorFromByteArray([...c, DEFAULTOUTLINETRANSPARENCY]));

    return getScalesStyleFunction(statisticsClasses, attributeDataKey, outlineColorClasses, colorClasses);
}

/**
 * 
 * @param {Array} color  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 * @param {Object} statistics 
 * @param {string} attributeDataKey
 */
export const getCartogramStyleFunction = (color, fillTransparency = DEFAULTFILLTRANSPARENCY, statistics, attributeDataKey) => {
    const usePercentiles = statistics.hasOwnProperty('percentile') && statistics.percentile.length > 1;

    const classCount = usePercentiles ? getClassCount(statistics.percentile) || 1 : 5;
    let statisticsClasses = usePercentiles ? statistics.percentile : getValueClassesByStatistics(statistics, classCount);

    const colorByteArrayClasses = getCartogramColorScale(color, classCount);
    const colorClasses = colorByteArrayClasses.map((c) => Color.colorFromByteArray([...c, fillTransparency]));

    const outlineColorByteArrayClasses = transformScaleDarker(colorByteArrayClasses, 2);
    const outlineColorClasses = outlineColorByteArrayClasses.map((c) => Color.colorFromByteArray([...c, DEFAULTOUTLINETRANSPARENCY]));

    return getScalesStyleFunction(statisticsClasses, attributeDataKey, outlineColorClasses, colorClasses);
}

/**
 * 
 * @param {Array} statisticsClasses  
 * @param {string} attributeDataKey  
 * @param {Array} outlineColorClasses
 * @param {Array} colorClasses
 */
export const getScalesStyleFunction = (statisticsClasses, attributeDataKey, outlineColorClasses, colorClasses) => {
    //create 5 classes
    return (renderable, layer) => {
        const attributes = new ShapeAttributes();
        const value = renderable.userProperties[attributeDataKey];
        let valueColor;
        let outlineValueColor;
        if(value || value === 0) {
            let calassIndex;
            if(useLogScale) {
                calassIndex = getLogClassByValue(statisticsClasses, value);
            } else {
                calassIndex = getClassByValue(statisticsClasses, value);
            }
            valueColor = colorClasses[calassIndex];
            outlineValueColor = outlineColorClasses[calassIndex];
        }

        //color not found for given value or no data
        if(!valueColor) {
            attributes.interiorColor = Color.colorFromByteArray(noDataPalette.colorTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(noDataPalette.darkerTransparentRgba);
        } else if (renderable.filtered) {
            attributes.interiorColor = Color.colorFromByteArray(filteredPalette.lighterTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
        } else if (renderable.selected) {
            attributes.interiorColor = valueColor;
            attributes.outlineColor = Color.colorFromByteArray([hoverPalette.colorRgb]);            
            attributes.outlineWidth = 5;    
        } else if (renderable.hovered) {
            attributes.interiorColor = Color.colorFromByteArray(hoverPalette.colorOpaqueRgba);
            attributes.outlineColor = Color.colorFromByteArray(hoverPalette.darkerTransparentRgba);    
        } else {
            attributes.interiorColor = valueColor;
            attributes.outlineColor = outlineValueColor; //gray
        }

        return attributes;
    }
}