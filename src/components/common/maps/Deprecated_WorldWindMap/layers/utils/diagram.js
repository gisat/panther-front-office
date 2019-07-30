
export const getCircleRadiusByVolume = (value) => {
    return Math.sqrt(value / Math.PI, 2) ;
}

export const getRadius = (value, series, normalizationCallback) => {
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

    if(normalizationCallback && typeof normalizationCallback === 'function') {
        return normalizationCallback(radius);
    } else {
        return radius;
    }
}