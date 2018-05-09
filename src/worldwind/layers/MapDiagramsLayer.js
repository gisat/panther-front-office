import WorldWind from '@nasaworldwind/worldwind';

import MyRenderableLayer from './MyRenderableLayer';

/**
 * Class representing layer with map diagrams. It extends MyRenderableLayer.
 * @param options {Object}
 * @augments MyRenderableLayer
 * @constructor
 */
class MapDiagramsLayer extends MyRenderableLayer {

    /**
     * Redraw layer
     * @param attributes {Array} list of attributes and their statistics
     * @param units {Array} list of analytical units with attributes values
     */
    redraw(attributes, units) {
        this.removeAllRenderables();

        let self = this;
        let diagramWidth = this.getDiagramWidth(attributes.length);
        units.forEach(function (unit) {
            unit.attributes.forEach(function (attribute, index) {
                let diagramHeight = self.getDiagramHeight(attribute.value, attributes[index].max, attributes[index].min) * 1000;
                self.addDiagram(index, unit.center.coordinates[0], diagramWidth, diagramHeight, attributes[index].color);
            });
        });
    };

    addDiagram(i, location, width, height, color) {
        console.log(i, location, width, height, color);
        let lat = location.y;
        let lon = location.x;
        let rgb = this.hexToRgb(color);

        let boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(lat, lon + (i * width), height));
        boundaries[0].push(new WorldWind.Position(lat + width, lon + (i * width), height));
        boundaries[0].push(new WorldWind.Position(lat + width, lon + width * (i + 1), height));
        boundaries[0].push(new WorldWind.Position(lat, lon + width * (i + 1), height));

        let polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = true;

        let polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = new WorldWind.Color(0.1, 0.1, 0.1, 1);
        polygonAttributes.interiorColor = new WorldWind.Color(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
        polygonAttributes.drawVerticals = polygon.extrude;
        polygon.attributes = polygonAttributes;
        this.addRenderable(polygon);
    };

    /**
     * Count hight of the diagram based on range
     * TODO move this method outside the loop
     * @param value {number} value of attribute for given unit
     * @param maxValue {number} max value of attribute
     * @param minValue {number} min value of attribute
     * @returns {number} height ratio (from 1 to 100)
     */
    getDiagramHeight(value, maxValue, minValue) {
        let diff = Math.abs(maxValue - minValue);
        let diffRatio = maxValue / diff;
        if (diffRatio < 100) {
            return 100 * (value - minValue) / (maxValue - minValue) + 1;
        } else {
            return 100;
        }
    };

    /**
     * Count width of the diagram based on number of attributes
     * TODO reflect size of the unit in ratio
     * @param count {number} number of attributes
     * @returns {number} width of diagram in degrees
     */
    getDiagramWidth(count) {
        let coeff = 0.3;
        return coeff / Math.round((count / 3) + 1);
    };

    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
}

export default MapDiagramsLayer;