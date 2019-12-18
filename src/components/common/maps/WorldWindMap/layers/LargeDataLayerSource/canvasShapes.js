/**
 * @param context
 * @param x0 {number} starting x coordinate
 * @param y0 {number} starting y coordinate
 * @param x1 {number} ending x coordinate
 * @param y1 {number} ending y coordinate
 * @param color {string} hex code
 * @param width {number} line width in pixels
 */
function arrow(context, x0, y0, x1, y1, color, width) {
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.strokeStyle = color;
	context.lineWidth = width;
	context.stroke();
}

/**
 * @param context
 * @param cx {number} x coordinate of center
 * @param cy {number} y coordinate of center
 * @param rx {number} x radius
 * @param ry {number} y radius
 * @param style {Object}
 */
function ellipse(context, cx, cy, rx, ry, style) {
	context.save(); // save state
	context.beginPath();

	context.translate(cx-rx, cy-ry);
	context.scale(rx, ry);
	context.arc(1, 1, 1, 0, 2 * Math.PI, false);

	fillPolygon(context, style);
}

function path(context, nodes, style) {
	context.save(); // save state
	context.beginPath();

	nodes.forEach((node, index) => {
		if (index === 0) {
			context.moveTo(node[0], node[1]);
		} else {
			context.lineTo(node[0], node[1]);
		}
	});

	fillPolygon(context, style);
}

/**
 *
 * @param context
 * @param x0
 * @param y0
 * @param dx
 * @param dy
 * @param style
 */
function rectangle(context, x0, y0, dx, dy, style) {
	context.save(); // save state
	context.beginPath();
	context.rect(x0, y0, dx, dy);

	fillPolygon(context, style);
}



// helpers
function fillPolygon(context, style) {
	context.restore(); // restore to original state
	context.shadowColor = style.shadowColor;
	context.shadowBlur = style.shadowBlur;
	context.fillStyle = style.fill;
	context.lineWidth = style.outlineWidth;
	context.strokeStyle = style.outlineColor;
	context.globalAlpha = style.fillOpacity || style.outlineOpacity; // TODO solve opacity properly
	context.fill();
	context.stroke();
}


export default {
	arrow,
	ellipse,
	path,
	rectangle
}