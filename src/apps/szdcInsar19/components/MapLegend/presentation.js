import React from 'react';
import _ from 'lodash';

import {DEFAULT_SIZE, DEFAULT_STYLE_OBJECT} from "../../../../utils/mapStyles";
import './style.scss';

class MapLegend extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	// render() {
	// 	return (
	// 		<div className="szdcInsar19-legend-content">
	// 			{this.props.layers && this.props.layers.map(layer => this.renderLayerLegend(layer))}
	// 		</div>
	// 	);
	// }

	render() {
		const props = this.props;
		let content = null;
		if (props.activeAppView && props.activeAppView.startsWith('track')) {
			content = this.renderTracksLegend();
		}
		return (
			<div className="szdcInsar19-legend-content">
				{content}
			</div>
		);
	}

	renderTracksLegend() {

		const props = this.props;

		let tracks = props.layers && props.layers.map(layer => {
			const name = layer.name;
			const rules = layer.style && layer.style.data && layer.style.data.definition && layer.style.data.definition.rules;
			const shapeStyle = rules && rules[0] && _.find(rules[0].styles, (style) => style.hasOwnProperty(('shape')));
			// const shape = shapeStyle && shapeStyle.shape;
			return name && shapeStyle && {name, shapeStyle};
		});

		let attributes = props.layers && props.layers.map(layer => {
			const name = layer.name;
			const rules = layer.style && layer.style.data && layer.style.data.definition && layer.style.data.definition.rules;
			const shapeStyle = rules && rules[0] && _.find(rules[0].styles, (style) => style.hasOwnProperty(('shape')));
			const attributeStyles = rules && rules[0] && _.filter(rules[0].styles, (style) => style.hasOwnProperty(('attributeKey')));
			if (attributeStyles && attributeStyles.length) {
				return attributeStyles.map(style => {
					let attribute = layer.attributes[style.attributeKey];
					return {
						key: style.attributeKey,
						attribute,
						style
					};
				});
			}
		});

		return tracks && tracks.map(track => {
			if (track) {
				return (
					<div>
						{this.renderSymbol(track.shapeStyle)}
						{track.name}
					</div>
				);
			}
		});

	}

	renderLayerLegend(layer) {
		const name = layer.name;
		const rules = layer.style && layer.style.data && layer.style.data.definition && layer.style.data.definition.rules;
		let content = null;

		if (rules) {
			content = rules.map(rule => {
				const styles = rule.styles;
				const attributeStyles = _.filter(styles, (style) => !!style.hasOwnProperty(('attributeKey')));
				const defaultStyle = _.find(styles, (style) => !style.hasOwnProperty(('attributeKey')));

				if (defaultStyle && attributeStyles.length) {
					return attributeStyles.map((attributeStyle, index) => {
						let attributeMetadata = layer.attributes[attributeStyle.attributeKey];
						let content = null;

						if (attributeStyle.attributeClasses) {
							content = this.renderIntervals(attributeStyle.attributeClasses, defaultStyle);
						} else if (attributeStyle.attributeValues) {
							content = this.renderValues(attributeStyle.attributeValues, defaultStyle);
						}
						// TODO add other cases

						return (
							<div className="szdcInsar19-legend-attribute" key={index}>
								{attributeMetadata ? (
									<div className="szdcInsar19-legend-attribute-header">
										<div className="szdcInsar19-legend-attribute-name">{attributeMetadata.data.nameDisplay}</div>
										{attributeMetadata.data.description ?
											(<div className="szdcInsar19-legend-attribute-description">{attributeMetadata.data.description}</div>) : null}
									</div>
								) : null}
								<div className="szdcInsar19-legend-attribute-content">{content}</div>
							</div>
						);
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
		}

		return (
			<div className="szdcInsar19-legend-layer" key={layer.key}>
				{name ? <div className="szdcInsar19-legend-layer-name">{name}</div> : null}
				{content}
			</div>
		);
	}

	renderIntervals(classes, defaultStyle) {
		return classes.map((cls, index) => {
			const {interval, intervalBounds, ...style} = cls;
			return (
				<div className="szdcInsar19-legend-item" key={index}>
					{this.renderSymbol({...DEFAULT_STYLE_OBJECT, ...defaultStyle, ...style})}
					<div>{interval[0]} to {interval[1]}</div>
				</div>
			);
		});
	}

	renderValues(values, defaultStyle) {
		return _.map(values, (style, value) => {
			return (
				<div className="szdcInsar19-legend-item" key={value}>
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
			case 'diamond':
				return this.renderDiamond(style);
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
				<rect width={size} height={size} style={svgStyle}/>
			</svg>
		);
	}

	renderDiamond(style) {
		const size = DEFAULT_SIZE;
		const diagonalSize = Math.sqrt(2) * (size + 2*style.outlineWidth);
		const transformation = `rotate(45, ${size/2}, ${size/2}) translate(${(diagonalSize - size)/2})`;

		const svgStyle = this.getSvgStyle(style);
		return (
			<svg width={diagonalSize} height={diagonalSize}>
				<g transform={transformation}>
					<rect width={size} height={size} style={svgStyle}/>
				</g>
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