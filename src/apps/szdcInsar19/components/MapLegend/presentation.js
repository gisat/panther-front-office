import React from 'react';
import _ from 'lodash';

import {DEFAULT_SIZE, DEFAULT_STYLE_OBJECT} from "../../../../utils/mapStyles";
import './style.scss';

//todo utils?
const formatInterval = (interval, bounds) => {
	bounds = bounds || [true, false];
	return (bounds[0] ? "[" : "(") + interval[0] + ", " + interval[1] + (bounds[1] ? "]" : ")");
};

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
		let tracks, sizes, scale, classes, enumValues;

		props.layers && props.layers.forEach(layer => {

			const name = layer.name;
			const rules = layer.style && layer.style.data && layer.style.data.definition && layer.style.data.definition.rules;

			if (rules && rules[0] && rules[0].styles) {

				// tracks
				const shapeStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('shape'));
				if (name && shapeStyle) {
					tracks = tracks || [];
					tracks.push({name, shapeStyle});
				}

				//sizes
				const sizeStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('attributeClasses') && style.attributeClasses[0].hasOwnProperty('size'));
				if (sizeStyle) {
					const attribute = layer.attributes[sizeStyle.attributeKey];
					sizes = {
						attribute,
						style: sizeStyle.attributeClasses
					};
				}

				//scale

				//classes
				const classesStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('attributeClasses') && style.attributeClasses[0].hasOwnProperty('fill'));
				if (classesStyle) {
					const attribute = layer.attributes[classesStyle.attributeKey];
					classes = {
						attribute,
						style: classesStyle.attributeClasses
					};
				}

				//enum
				const enumStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('attributeValues') && _.find(style.attributeValues, value => value.hasOwnProperty('fill')));
				if (enumStyle) {
					const attribute = layer.attributes[enumStyle.attributeKey];
					enumValues = {
						attribute,
						style: enumStyle.attributeValues
					};
				}


			}

		});

		return (
			<>
				<div>
					{classes && (
						<div className="szdcInsar19-legend-section">
							<span>{classes.attribute.data.nameDisplay}</span>
							<div>
								{classes.style.map(styleClass => (
									<div className="szdcInsar19-legend-class">
										<div style={{background: styleClass.fill}}/>
										<span>{formatInterval(styleClass.interval, styleClass.intervalBounds)}</span>
									</div>
								))}
							</div>
						</div>
					)}
					
					{enumValues && (
						<div className="szdcInsar19-legend-section">
							<span>{enumValues.attribute.data.nameDisplay}</span>
							<div>
								{_.map(enumValues.style, (enumStyle, enumKey) => (
									<div className="szdcInsar19-legend-class">
										<div style={{background: enumStyle.fill}}/>
										<span>{enumKey}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div>
					{tracks && (
						<div className="szdcInsar19-legend-section">
							<span>Tracky</span>
							<div>
								{tracks.map(track => {
									if (track) {
										return (
											<div className="szdcInsar19-legend-track">
												{this.renderSymbol(track.shapeStyle)}
												<span>{track.name}</span>
											</div>
										);
									}
								})}
							</div>
						</div>
					)}
					
					{sizes && (
						<div className="szdcInsar19-legend-section">
							<span>{sizes.attribute.data.nameDisplay}</span>
							<div>
								{sizes.style.map(styleClass => (
									<div className="szdcInsar19-legend-class">
										<div><div style={{transform: `scale(${styleClass.size/15})`}}>{this.renderCircle()}</div></div>
										<span>{formatInterval(styleClass.interval, styleClass.intervalBounds)}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</>
		);

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
		const outlineWidth = style && style.outlineWidth || 0;
		return (
			<svg width={size + 2*outlineWidth} height={size + 2*outlineWidth}>
				<circle cx={size/2 + outlineWidth} cy={size/2 + outlineWidth} r={size/2} style={svgStyle}/>
			</svg>
		);
	}

	renderSquare(style) {
		const size = DEFAULT_SIZE * 0.9;
		const svgStyle = this.getSvgStyle(style);
		const outlineWidth = style && style.outlineWidth || 0;
		return (
			<svg width={size + 2*outlineWidth} height={size + 2*outlineWidth}>
				<rect width={size} height={size} style={svgStyle}/>
			</svg>
		);
	}

	renderDiamond(style) {
		const size = DEFAULT_SIZE * 0.85;
		const outlineWidth = style && style.outlineWidth || 0;
		const diagonalSize = Math.sqrt(2) * (size + 2*outlineWidth);
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
		if (style) {
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
		}

		return svgStyle;
	}
}

export default MapLegend;