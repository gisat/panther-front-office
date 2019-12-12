/**
 * Constructs a HeatMapTile.
 *
 * Returns one tile for the HeatMap information. It is basically an interface specifying the public methods
 * properties and default configuration. The logic itself is handled in the subclasses.
 *
 * @alias HeatMapTile
 * @constructor
 * @classdesc Tile for the HeatMap layer visualising data on a canvas using shades of gray scale.
 *
 * @param data {Object[]} Array of information constituting points in the map.
 * @param options {Object}
 * @param options.sector {Sector} Sector representing the geographical area for this tile. It is used to correctly
 *  interpret the location of the MeasuredLocation on the resulting canvas.
 * @param options.width {Number} Width of the Canvas to be created in pixels.
 * @param options.height {Number} Height of the Canvas to be created in pixels.
 * @param options.radius {Number} Radius of the data point in pixels. The radius represents the blur applied to the
 *  drawn shape
 * @param options.incrementPerIntensity {Number} The ratio representing the 1 / measure for the maximum measure.
 * @param options.intensityGradient {Object} Keys represent the opacity between 0 and 1 and the values represent
 *  color strings.
 */
import mapStyles, {DEFAULT_SIZE} from "../../../../../../utils/mapStyles";
import shapes from "./canvasShapes";
import _ from "lodash";

class LargeDataLayerTile {

	constructor(data, options, style, fidColumnName, selected, hovered) {
		this._data = data;
		this._style = style;
		this._fidColumnName = fidColumnName;
		this._hovered = hovered;

		// todo here?
		if (this._hovered && this._hovered.keys) {
			this._hoveredStyle = mapStyles.getStyleObject(null, this._hovered.style, true); // todo add default
		}

		if (selected && !_.isEmpty(selected)) {
			let sel = [];
			_.forIn(selected, (selectedDef) => {
				if (selectedDef && !_.isEmpty(selectedDef)) {
					sel.push({
						keys: selectedDef.keys,
						style: mapStyles.getStyleObject(null, selectedDef.style, true) // todo add default
					});
				}
			});

			this._selected = sel.length ? sel : null;
		}

		this._sector = options.sector;

		this._canvas = this.createCanvas(options.width, options.height);

		this._width = options.width;
		this._height = options.height;

		const tileCenterLatitude = (this._sector.maxLatitude + this._sector.minLatitude)*(Math.PI/180)/2;
		this._latitudeFactor = 1/Math.cos(Math.abs((tileCenterLatitude)));
	};

	/**
	 * Returns the drawn HeatMapTile in the form of URL.
	 * @return {String} Data URL of the tile.
	 */
	url() {
		return this.draw().toDataURL();
	};

	/**
	 * Returns the whole Canvas. It is then possible to use further. This one is actually used in the
	 * HeatMapLayer mechanism so if you want to provide some custom implementation of Canvas creation in your tile,
	 * change this method.
	 * @return {HTMLCanvasElement} Canvas Element representing the drawn tile.
	 */
	canvas() {
		return this.draw();
	};

	/**
	 * Draws the shapes on the canvas.
	 * @returns {HTMLCanvasElement}
	 */
	draw() {
		const ctx = this._canvas.getContext('2d');
		let hovered = [];
		let selected = [];

		for (let i = 0; i < this._data.length; i++) {
			const dataPoint = this._data[i];
			const attributes = dataPoint.data;
			let style = mapStyles.getStyleObject(attributes, this._style);

			let isHovered = this.isHovered(attributes);
			let isSelected = this.isSelected(attributes);

			if (isSelected) {
				selected.push(dataPoint);
			} else if (isHovered) {
				hovered.push(dataPoint);
			} else {
				this.shape(ctx, dataPoint);
			}
		}

		// draw hovered
		hovered.forEach(dataPoint => {
			this.shape(ctx, dataPoint, true);
		});

		// draw selected
		selected.forEach(dataPoint => {
			this.shape(ctx, dataPoint, false, true);
		});

		return this._canvas;
	};

	isHovered(attributes) {
		if (this._hovered && this._hovered.keys) {
			return this._hovered.keys.indexOf(attributes[this._fidColumnName]) !== -1;
		}
	}

	isSelected(attributes) {
		let isSelected = false;
		if (this._selected) {
			this._selected.forEach(selection => {
				let selected = selection.keys.indexOf(attributes[this._fidColumnName]) !== -1;
				if (selected) {
					isSelected = true;
				}
			});
		}
		return isSelected;
	}

	shape(context, data, hovered, selected) {
		let attributes = data.data;
		let style = mapStyles.getStyleObject(attributes, this._style);

		// apply hovered style, if feature is hovered
		if (hovered) {
			style = {...style, ...this._hoveredStyle};
		}

		// TODO optimize looping through selections two times
		// apply selected style, if feature is selected
		if (selected) {
			this._selected.forEach(selection => {
				let selected = selection.keys.indexOf(attributes[this._fidColumnName]) !== -1;
				if (selected) {
					style = {...style, ...selection.style};
				}
			});
		}

		if (style.shape) {
			if (style.shape === "circle-with-arrow") {
				this.circleWithArrow(context, data, style)
			} else if (style.shape === "circle") {
				this.point(context, data, style)
			} else if (style.shape === "square") {
				this.square(context, data, style)
			} else if (style.shape === "diamond") {
				this.diamond(context, data, style)
			} else if (style.shape === "triangle") {
				this.triangle(context, data, style)
			} else {
				this.point(context, data, style)
			}
		} else {
			this.point(context, data, style)
		}
	}

	point(context, data, style) {
		let radius = this.getSize(style)/2;
		let center = this.getCenterCoordinates(data);
		let cy = radius;
		let cx = radius * this._latitudeFactor;

		shapes.ellipse(context, center[0], center[1], cx, cy, style);
	}

	square(context, data, style) {
		let size = this.getSize(style);
		let center = this.getCenterCoordinates(data);
		let dx = size * this._latitudeFactor;

		shapes.rectangle(context, center[0], center[1], dx, size, style);
	}

	diamond(context, data, style) {
		let edgeLength = this.getSize(style);
		let diagonalLength = Math.sqrt(2) * edgeLength;

		// center coordinates
		let center = this.getCenterCoordinates(data);

		let dx = diagonalLength * this._latitudeFactor;
		let nodes = [
			[center[0]-dx/2, center[1]],
			[center[0], center[1] - diagonalLength/2],
			[center[0] + dx/2, center[1]],
			[center[0], center[1] + diagonalLength/2],
			[center[0]-dx/2, center[1]]
		];

		shapes.path(context, nodes, style);
	}

	triangle(context, data, style) {
		let edgeLength = this.getSize(style);
		let ty = Math.sqrt(Math.pow(edgeLength, 2) - Math.pow(edgeLength/2, 2));

		// center coordinates
		let center = this.getCenterCoordinates(data);
		
		let dx = edgeLength * this._latitudeFactor;
		let nodes = [
			[center[0]-dx/2, center[1] + ty/3],
			[center[0], center[1] - 2*ty/3],
			[center[0] + dx/2, center[1] + ty/3],
			[center[0]-dx/2, center[1] + ty/3]
		];

		shapes.path(context, nodes, style);
	}

	circleWithArrow(context, data, style) {
		let radius = this.getSize(style)/2;
		let direction = style.arrowDirection || 1;

		let center = this.getCenterCoordinates(data);
		let ry = radius;
		let rx = radius * this._latitudeFactor;

		shapes.ellipse(context, center[0], center[1], rx, ry, style);

		let x0 = center[0] + direction*rx;
		let y0 = center[1];
		let x1 = x0 + direction*style.arrowLength;
		let y1 = y0;

		shapes.arrow(context, x0, y0, x1, y1, style.arrowColor, style.arrowWidth)
	}

	getSize(style) {
		if (style.size) {
			return style.size;
		} else if (style.volume) {
			if (style.shape === 'triangle') {
				return Math.sqrt(style.volume/2);
			} else if (style.shape === 'square' || style.shape === 'diamond') {
				return Math.sqrt(style.volume);
			} else {
				return Math.sqrt(style.volume/Math.PI);
			}
		} else {
			return DEFAULT_SIZE;
		}
	}
	
	getCenterCoordinates(data) {
		return [
			this.longitudeInSector(data, this._sector, this._width),
			this._height - this.latitudeInSector(data, this._sector, this._height)
		]
	}

	/**
	 * Creates canvas element of given size.
	 * @protected
	 * @param width {Number} Width of the canvas in pixels
	 * @param height {Number} Height of the canvas in pixels
	 * @returns {HTMLCanvasElement} Created the canvas
	 */
	createCanvas(width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		return canvas;
	};

	/**
	 * Calculates position in pixels of the point based on its latitude.
	 * @param dataPoint {Object} Location to transform
	 * @param sector {Sector} Sector to which transform
	 * @param height {Number} Height of the tile to draw to.
	 * @private
	 * @returns {Number} Position on the height in pixels.
	 */
	latitudeInSector(dataPoint, sector, height) {
		var sizeOfArea = sector.maxLatitude - sector.minLatitude;
		var locationInArea = (dataPoint.y - 90) - sector.minLatitude;
		return Math.ceil((locationInArea / sizeOfArea) * height);
	};

	/**
	 * Calculates position in pixels of the point based on its longitude.
	 * @param dataPoint {Object} Location to transform
	 * @param sector {Sector} Sector to which transform
	 * @param width {Number} Width of the tile to draw to.
	 * @private
	 * @returns {Number} Position on the width in pixels.
	 */
	longitudeInSector(dataPoint, sector, width) {
		var sizeOfArea = sector.maxLongitude - sector.minLongitude;
		var locationInArea = (dataPoint.x - 180) - sector.minLongitude;
		return Math.ceil((locationInArea / sizeOfArea) * width);
	};
}

export default LargeDataLayerTile;