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
        const interval2 = [
            moment(overlay.start),
            moment(overlay.end)
        ]
        
        return overlap(interval1, interval2);
    })
}

export const getIntersectionLayers = (time, layers = [], MOUSEBUFFERWIDTH = 0, dayWidth = 1) => {
    const overlays = layers.reduce((acc, l) => {
        if(l.period && l.period.length) {
            const cfgs =l.period.map((period, index) => {
                return {
                    layerTemplateKey: l.layerTemplateKey,
                    period: true,
                    index: index,
                    start: period.start,
                    end: period.end
                }
            })
            return [...acc, ...cfgs];

        } else {
            const cfg = {
                layerTemplateKey: l.layerTemplateKey,
                period: false,
                start: l.period.start,
                end: l.period.end
            }
            return [...acc, cfg];
        }
    }, []);

    const intersection = getIntersectionOverlays(time, overlays, MOUSEBUFFERWIDTH, dayWidth);

    return layers.reduce((acc, layer) => {
        const intersectionOverlays = intersection.filter((i) => i.layerTemplateKey === layer.layerTemplateKey);
        if(intersectionOverlays && intersectionOverlays.length) {
            if(intersectionOverlays[0].period) {
                const intersectionPeriodsIndexes = intersectionOverlays.map(i => i.index);
                const layerWithPeriods = {...layer, period: layer.period.filter((p,i) => intersectionPeriodsIndexes.includes(i))};
                return [...acc, layerWithPeriods];
            } else {
                return [...acc, layer];
            }
        } else {
            return acc;
        }
    },[]);
}