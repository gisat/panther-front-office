import WorldWind from "webworldwind-esa";
import {statistics as pantherStatistics} from '@gisatcz/ptr-utils';
import {
    DEFAULTFILLTRANSPARENCY,
    DEFAULTOUTLINETRANSPARENCY,
    getCartogramColorScale,
    transformScaleDarker,
} from '@gisatcz/ptr-deprecated'

const {Color, ShapeAttributes} = WorldWind;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getStyleFunction = (min, max, numClasses, color) => {
    const statistics = {
        min,
        max
    };
    const classCount = numClasses || 1;
    const statisticsClasses = pantherStatistics.getValueClassesByStatistics(statistics, classCount);

    const colorClasses = getCartogramColorScale(color, classCount);
    const outlineColorClasses = transformScaleDarker(colorClasses, 2);
    

    return (renderable, layer) => {
        const attributes = new ShapeAttributes();
        const value = renderable.userProperties.ucast;
        if(value || value === 0) {
            const calassIndex = pantherStatistics.getClassByValue(statisticsClasses, value);
            const valueColor = colorClasses[calassIndex];
            const outlineValueColor = outlineColorClasses[calassIndex];
            
            attributes.interiorColor = Color.colorFromByteArray([...valueColor, DEFAULTFILLTRANSPARENCY]);
            attributes.outlineColor = Color.colorFromByteArray([...outlineValueColor, DEFAULTOUTLINETRANSPARENCY]); //gray
        }

        return attributes;
    }
}