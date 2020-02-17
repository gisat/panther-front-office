import WorldWind from "webworldwind-esa";

import {statistics as pantherStatistics} from "panther-utils";
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

    const classCount = usePercentiles ? pantherStatistics.getClassCount(statistics.percentile) || 1 : 5;
    const statisticsClasses = usePercentiles ? statistics.percentile : pantherStatistics.getValueClassesByStatistics(statistics, classCount);
    
    //statistics percentiles can be calculated from more statistics
    //min & max values are min max, not average
    if(usePercentiles) {
        pantherStatistics.setClassesMinMaxFromStatistics(statisticsClasses, statistics);
    }
    const colorClasses = getCartogramColorScale(color, classCount);
    const outlineColorClasses = transformScaleDarker(colorClasses, 2);
    

    //create 5 classes
    return (renderable, layer) => {
        const attributes = new ShapeAttributes();
        const value = renderable.userProperties[attributeDataKey];
        let valueColor;
        let outlineValueColor;
        if(value || value === 0) {
            const calassIndex = pantherStatistics.getClassByValue(statisticsClasses, value);
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
            attributes.interiorColor = Color.colorFromByteArray([...valueColor, fillTransparency]);
            attributes.outlineColor = Color.colorFromByteArray([hoverPalette.colorRgb]);            
            attributes.outlineWidth = 5;    
        } else if (renderable.hovered) {
            attributes.interiorColor = Color.colorFromByteArray(hoverPalette.colorOpaqueRgba);
            attributes.outlineColor = Color.colorFromByteArray(hoverPalette.darkerTransparentRgba);    
        } else {
            attributes.interiorColor = Color.colorFromByteArray([...valueColor, fillTransparency]);
            attributes.outlineColor = Color.colorFromByteArray([...outlineValueColor, DEFAULTOUTLINETRANSPARENCY]); //gray
        }

        return attributes;
    }
}