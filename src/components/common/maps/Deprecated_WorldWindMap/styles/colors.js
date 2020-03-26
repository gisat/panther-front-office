import chroma from 'chroma-js';

export const DEFAULTOUTLINETRANSPARENCY = 120 // 0-255
export const DEFAULTFILLTRANSPARENCY = 220 // 0-255

//GRAY colors
const gray0 = '#fffefc';
const gray1 = '#f4f3f1';
const gray2 = '#e8e7e5';
const gray3 = '#dad9d8';
const gray4 = '#c1c1bf';
const gray5 = '#a4a3a2';
const gray6 = '#858483';
const gray7 = '#6c6b6a';
const gray8 = '#5b5a5a';
const gray9 = '#484847';
const gray10 = '#323231';
const gray11 = '#1d1d1c';
const gray12 = '#040300';

//RED color
const red12 = '#ff0000';


export const getColorPallet = (baseColor, lighterColor, darkerColor, baseTransparency = 100) => {
    darkerColor = darkerColor ? chroma(darkerColor) : chroma(baseColor).darker(1);
    lighterColor = lighterColor ? chroma(lighterColor) : chroma(baseColor).brighten(1);
    return {
        color: chroma(baseColor),
        colorRgb: chroma(baseColor).rgb(),
        colorTransparentRgba: [...chroma(baseColor).rgb(), baseTransparency],
        colorOpaqueRgba: [...chroma(baseColor).rgb(), 255],
        
        darker: darkerColor,
        darkerRgb: darkerColor.rgb(),
        darkerTransparentRgba: [...darkerColor.rgb(), baseTransparency],
        darkerOpaqueRgba: [...darkerColor.rgb(), 255],
        
        lighter: lighterColor,
        lighterRgb: lighterColor.rgb(),
        lighterTransparentRgba: [...lighterColor.rgb(), baseTransparency],
        lighterOpaqueRgba: [...lighterColor.rgb(), 255],
    }
}

export const noDataAccentedPalette = getColorPallet(gray5, null, null, 120);
export const noDataPalette = getColorPallet(gray4);
export const filteredPalette = getColorPallet(gray4, gray2, gray5, 120);
export const hoverPalette = getColorPallet(red12);


export const transformScaleDarker = (scale, darknes = 2) => {
    const colors = [...scale.map(c => [...c])];
    return colors.map(c => chroma(c).darken(darknes).rgb())
}

export function getOutlineColor(color, darknes = 2, transparency = DEFAULTOUTLINETRANSPARENCY) {
    return [...chroma(color).darken(darknes).rgb(), transparency];
}

export function getBrightenColor(color, brightnes = 0, transparency = 255) {
    return [...chroma(color).brighten(brightnes).rgb(), transparency];
}
export const getCartogramColorScale = (color, classCount) => {
    const chromaColor = chroma(color);
    const hsl = chromaColor.hsl();
    //take only hue from defined color
    const hue = hsl[0];
    const colorScale = chroma.scale([chroma.hsl(hue, .95, .95), chroma.hsl(hue, .5, .5), chroma.hsl(hue, .95, .1)]).mode('lrgb');
    const colorClasses = colorScale.colors(classCount, null).map(c => c.saturate(1).rgb());
    return colorClasses;
};

export const getCartogramTwoColorScale = (highColor, lowColor, centerColor, classCount) => {
    const chromaHighColor = chroma(highColor);
    const chromaLowColor = chroma(lowColor);
    const chromaCenterColor = chroma(centerColor);
    const colorScale = chroma.scale([chromaLowColor, chromaCenterColor, chromaHighColor]).mode('lrgb');
    const colorClasses = colorScale.colors((classCount * 2), null).map(c => c.saturate(1).rgb());
    return colorClasses;
};

/**
 * 
 * Calculate percentil position of value between min and max values
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @param {Chromajs} palette 
 * @returns {Chromajs} color
 */
export const getColorByValue = (value, min, max, palette) => {
    return palette((value - min) / (max - min))
}