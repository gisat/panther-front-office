import WorldWind, {ImageSource} from "webworldwind-esa";
import chroma from 'chroma-js';
import {getCircle} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/images';
import {
    hoverPalette
} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'

import {getColorPallet} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors';

const {PlacemarkAttributes} = WorldWind;

/**
 * 
 * @param {Array} fillColorPalette  RGB color
 * @param {number} fillTransparency 0-255 (255 - no transparent)
 */
export const getStaticTreesStyleFunction = (fillColor, fillTransparency, outlinesColor, outlinesTransparency, outlinesWidth) => {
    const greenPallete = getColorPallet('#4caf50');
    
    const ctxImg = getCircle(`rgba(${greenPallete.lighterRgb.join(',')},0.5)`, 'black', 3, 50);
    const ctxImgHovered = getCircle(`rgba(${hoverPalette.lighterRgb.join(',')},0.5)`, 'black', 3, 50);
    const ctxImgSelected = getCircle(`rgba(${greenPallete.darkerRgb.join(',')},0.7)`, 'black', 3, 50);


    return (renderable, layer) => {
        let attributes = null;

        if(renderable.userProperties._geometryType === 'POINT') {
            attributes = new PlacemarkAttributes();

            if (renderable.hovered) {
                attributes.imageSource = ctxImgHovered;
            } else if (renderable.selected) {
                attributes.imageSource = ctxImgSelected;
            } else {
                attributes.imageSource = ctxImg;
            }

            attributes.imageScale = (Math.log(1 + (renderable.userProperties.CD * 2)) * 0.1);

        }
        return attributes;  
    }
}