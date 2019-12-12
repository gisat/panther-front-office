import React from 'react';
import _ from 'lodash';

import {DEFAULT_SIZE, DEFAULT_STYLE_OBJECT} from "../../../../utils/mapStyles";

class MapLegend extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{this.props.layers && this.props.layers.map(layer => this.renderLayerLegend(layer))}
			</div>
		);
	}

	renderLayerLegend(layer) {
		const rules = layer.style && layer.style.data && layer.style.data.definition && layer.style.data.definition.rules;
		if (rules) {
			return rules.map(rule => {
				const styles = rule.styles;
				const attributeStyles = _.filter(styles, (style) => !!style.hasOwnProperty(('attributeKey')));
				const defaultStyle = _.find(styles, (style) => !style.hasOwnProperty(('attributeKey')));

				if (defaultStyle && attributeStyles.length) {
					return attributeStyles.map(attributeStyle => {
						let attributeMetadata = layer.attributes[attributeStyle.attributeKey];
						if (attributeStyle.attributeClasses) {
							return this.renderIntervals(attributeStyle.attributeClasses, defaultStyle);
						} else if (attributeStyle.attributeValues) {
							return this.renderValues(attributeStyle.attributeValues, defaultStyle);
						}

						// TODO add other cases
						else {
							return null;
						}
					});
				} else if (defaultStyle) {
					// TODO
					return null;
				} else if (attributeStyles.length) {
					// TODO
					return null;
				} else {
					throw Error(layer.style.key + ": No style definition for rule")
				}
			});
		} else {
			return null;
		}
	}

	renderIntervals(classes, defaultStyle) {
		return classes.map(cls => {
			const {interval, intervalBounds, ...style} = cls;
			return (
				<div>
					{this.renderSymbol({...DEFAULT_STYLE_OBJECT, ...defaultStyle, ...style})}
					<div>{interval[0]} to {interval[1]}</div>
				</div>
			);
		});
	}

	renderValues(values, defaultStyle) {
		return _.map(values, (style, value) => {
			return (
				<div>
					{this.renderSymbol({...DEFAULT_STYLE_OBJECT, ...defaultStyle, ...style})}
					<div>{value}</div>
				</div>
			);
		});
	}

	renderSymbol(style) {
		switch (style.shape) {
			case 'triangle':
				return this.renderTriangle(style);
			case 'circle':
				return this.renderCircle(style);
			case 'square':
				return this.renderSquare(style);
			default:
				return null;
		}
	}

	renderTriangle(style) {
		// TODO common calculation of triangle size
		const size = DEFAULT_SIZE;
		const ty = Math.sqrt(Math.pow(size, 2) - Math.pow(size/2, 2));
		const points = `${size/2},${0} ${0},${ty} ${size},${ty}`;
		const svgStyle = this.getSvgStyle(style);

		return (
			<svg width={size + 2*style.outlineWidth} height={ty + 2* style.outlineWidth}>
				<polygon points={points} style={svgStyle} />
			</svg>
		);
	}

	renderCircle(style) {
		const size = DEFAULT_SIZE;
		const svgStyle = this.getSvgStyle(style);
		return (
			<svg width={size + 2*style.outlineWidth} height={size + 2*style.outlineWidth}>
				<circle cx={size/2 + style.outlineWidth} cy={size/2 + style.outlineWidth} r={size/2} style={svgStyle}/>
			</svg>
		);
	}

	renderSquare(style) {
		const size = DEFAULT_SIZE;
		const svgStyle = this.getSvgStyle(style);
		return (
			<svg width={size + 2*style.outlineWidth} height={size + 2*style.outlineWidth}>
				<rect width={size + 2*style.outlineWidth} height={size + 2*style.outlineWidth} style={svgStyle}/>
			</svg>
		);
	}

	getSvgStyle(style) {
		let svgStyle = {};
		if (style.fill) {
			svgStyle.fill = style.fill;
		}
		if (style.fillOpacity) {
			svgStyle.fillOpacity = style.fillOpacity;
		}
		if (style.outlineColor) {
			svgStyle.stroke = style.outlineColor;
		}
		if (style.outlineWidth) {
			svgStyle.strokeWidth = style.outlineWidth;
		}
		if (style.outlineOpacity) {
			svgStyle.strokeOpacity = style.outlineOpacity;
		}

		return svgStyle;
	}
}

export default MapLegend;