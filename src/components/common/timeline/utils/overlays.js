import moment from 'moment';

/**
 * 
 * @param {Array} one Interval in momentjs
 * @param {Array} two Interval in momentjs
 */
export const overlap = (one, two) => {
    return timeInRange(one[0], two) || timeInRange(one[1], two) || timeInRange(two[0], one) || timeInRange(two[1], one);
}

/**
 * Check if queryed time is inside time range
 * @param {Object} time Momentjs time
 * @param {Array} range 
 */
export const timeInRange = (time, range) => {
    return moment(time).isBetween(moment(range[0]), moment(range[1]), null, '[]');
}

export const getIntersectionOverlays = (time, overlays = [], MOUSEBUFFERWIDTH = 0, dayWidth = 1) => {
    const interval1 = [
        time.clone(),
        time.clone(),
    ];

    if(MOUSEBUFFERWIDTH) {
        interval1[0].subtract((MOUSEBUFFERWIDTH / dayWidth) * 24 * 60 * 60 * 1000, 'milliseconds');
        interval1[1].add((MOUSEBUFFERWIDTH / dayWidth) * 24 * 60 * 60 * 1000, 'milliseconds');
    }

    return overlays.filter(overlay => {
        // return moment(time).isBetween(moment(overlay.start), moment(overlay.end), null, '[]');
        const interval2 = [
            moment(overlay.start),
            moment(overlay.end)
        ]
        
        return overlap(interval1, interval2);
    })
}

export const getIntersectionLayers = (time, layers = [], MOUSEBUFFERWIDTH = 0, dayWidth = 1) => {
    const overlays = layers.map((l) => {
        l.start = l.period.start;
        l.end = l.period.end;
        return l;
    })
    const intersection = getIntersectionOverlays(time, overlays, MOUSEBUFFERWIDTH, dayWidth).map(i => i.layerKey);
    return layers.filter(l => intersection.includes(l.layerKey));
}