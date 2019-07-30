import WorldWind from "webworldwind-esa";
import {getValueClassesByStatistics, getClassByValue} from '../../../utils/statistics'
import {
    DEFAULTFILLTRANSPARENCY,
    DEFAULTOUTLINETRANSPARENCY,
    getCartogramColorScale,
    transformScaleDarker,
} from '../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'

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
    const statisticsClasses = getValueClassesByStatistics(statistics, classCount);

    const colorClasses = getCartogramColorScale(color, classCount);
    const outlineColorClasses = transformScaleDarker(colorClasses, 2);
    

    return (renderable, layer) => {
        const attributes = new ShapeAttributes();
        const value = renderable.userProperties.ucast;
        if(value || value === 0) {
            const calassIndex = getClassByValue(statisticsClasses, value);
            const valueColor = colorClasses[calassIndex];
            const outlineValueColor = outlineColorClasses[calassIndex];
            
            attributes.interiorColor = Color.colorFromByteArray([...valueColor, DEFAULTFILLTRANSPARENCY]);
            attributes.outlineColor = Color.colorFromByteArray([...outlineValueColor, DEFAULTOUTLINETRANSPARENCY]); //gray
        }

        return attributes;
    }
}