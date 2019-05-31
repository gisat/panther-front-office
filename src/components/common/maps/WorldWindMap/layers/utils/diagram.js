
export const getCircleRadiusByVolume = (value) => {
    return Math.sqrt(value / Math.PI, 2) ;
}

export const getRadius = (value, series, coefficient = 1) => {
    let radius;
    switch (series) {
        case 'value':
            radius = value;
            break;
        case 'volume':
            radius = getCircleRadiusByVolume(value) * 100//m
            break;
        default:
            radius = getCircleRadiusByVolume(value) * 100//m
            break;
    }
    return radius / coefficient;
}

export const getRadiusNormalizationCoefficient = (maximumRadius, maximumValue, series) => {
    const maxValRadius = getRadius(maximumValue, series, 1);
    if(maxValRadius > maximumRadius) {
        return maxValRadius / maximumRadius;
    }
}
