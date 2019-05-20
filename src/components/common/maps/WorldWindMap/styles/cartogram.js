import WorldWind from "webworldwind-esa";
import chroma from 'chroma-js';
import {getValueClassesByStatistics, getClassByValue, getClassCount} from '../../../../../utils/statistics'
import {
    DEFAULTFILLTRANSPARENCY,
    DEFAULTOUTLINETRANSPARENCY,
    getCartogramColorScale,
    transformScaleDarker,

    filteredPalette,
    noDataPalette,
    hoverPalette,
} from './colors'

const {Color, ShapeAttributes} = WorldWind;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getCartogramStyleFunction = (color, fillTransparency = DEFAULTFILLTRANSPARENCY, statistics, attributeDataKey) => {
    const usePercentiles = statistics.hasOwnProperty('percentile') && statistics.percentile.length > 1;

    const classCount = usePercentiles ? getClassCount(statistics.percentile) || 1 : 5;
    const statisticsClasses = statistics.percentile || getValueClassesByStatistics(statistics, classCount);
    const colorClasses = getCartogramColorScale(color, classCount);
    const outlineColorClasses = transformScaleDarker(colorClasses, 2);
    

    //create 5 classes
    return (renderable, layer) => {
        const attributes = new ShapeAttributes();
        const value = renderable.userProperties[attributeDataKey];
        let valueColor;
        let outlineValueColor;
        if(value || value === 0) {
            const calassIndex = getClassByValue(statisticsClasses, renderable.userProperties[attributeDataKey]);
            valueColor = colorClasses[calassIndex];
            outlineValueColor = outlineColorClasses[calassIndex];
        }

        //color not found for given value or no data
        if(!valueColor) {
            attributes.interiorColor = Color.colorFromByteArray(noDataPalette.colorTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(noDataPalette.darkerTransparentRgba);
        } else if (renderable.hovered) {
            attributes.interiorColor = Color.colorFromByteArray(hoverPalette.colorOpaqueRgba);
            attributes.outlineColor = Color.colorFromByteArray(hoverPalette.darkerTransparentRgba);    
        } else if (renderable.filtered) {
            attributes.interiorColor = Color.colorFromByteArray(filteredPalette.colorTransparentRgba);
            attributes.outlineColor = Color.colorFromByteArray(filteredPalette.darkerTransparentRgba);
    } else {
            attributes.interiorColor = Color.colorFromByteArray([...valueColor, fillTransparency]);
            attributes.outlineColor = Color.colorFromByteArray([...outlineValueColor, DEFAULTOUTLINETRANSPARENCY]); //gray
        }

        return attributes;
    }
}