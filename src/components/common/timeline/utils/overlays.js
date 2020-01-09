import moment from 'moment';
export const getIntersectionOverlays = (time, overlays = []) => {
    return overlays.filter(overlay => {
        return moment(time).isBetween(moment(overlay.start), moment(overlay.end), null, '[]');
    })
}