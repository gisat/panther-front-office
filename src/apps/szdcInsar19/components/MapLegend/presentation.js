import React from 'react';
import _ from 'lodash';

// import mapStyles, {DEFAULT_SIZE, DEFAULT_STYLE_OBJECT} from "../../../../utils/mapStyles";
import utils from '@gisatcz/ptr-utils'
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
		if (props.activeAppView) {
			content = this.renderLegend();
		}
		return (
			<div className="szdcInsar19-legend-content">
				{content}
			</div>
		);
	}

	renderLegend() {

		const props = this.props;
		const showTracks = props.activeAppView && props.activeAppView.startsWith('track');
		let tracks, sizes, scale, classes, enumValues, arrowData;

		props.layers && props.layers.forEach(layer => {

			const name = layer.name;
			const rules = layer.style && layer.style.data && layer.style.data.definition && layer.style.data.definition.rules;

			if (rules && rules[0] && rules[0].styles) {

				// tracks
				if (showTracks) {
					const shapeStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('shape'));
					if (name && shapeStyle) {
						tracks = tracks || [];
						tracks.push({name, shapeStyle});
					}
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

				// arrow
				const baseStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('shape') && style.shape === 'circle-with-arrow');
				const directionStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('attributeTransformation') && style.attributeTransformation.hasOwnProperty('arrowDirection'));
				const lengthStyle = _.find(rules[0].styles, (style) => style.hasOwnProperty('attributeScale') && style.attributeScale.hasOwnProperty('arrowLength'));

				if (baseStyle && (directionStyle || lengthStyle)) {
					const attributeKey = directionStyle.attributeKey || lengthStyle.attributeKey;
					const attribute = layer.attributes[attributeKey];


					// format for utils/mapStyles
					const styleDefinition = {rules: [{styles: [baseStyle, directionStyle, lengthStyle]}]};
					const styleValues = [
						{[attributeKey]: -10},
						{[attributeKey]: 10}
					];

					arrowData = {
						attribute,
						styleDefinition,
						styleValues
					};
				}

			}

		});

		return (
			<>
				<div>
					{classes && (
						<div className="szdcInsar19-legend-section">
							<span>{classes.attribute && classes.attribute.data.nameDisplay}</span>
							<div>
								{classes.style.map((styleClass, index) => (
									<div key={index} className="szdcInsar19-legend-class">
										<div style={{background: styleClass.fill}}/>
										<span>{formatInterval(styleClass.interval, styleClass.intervalBounds)}</span>
									</div>
								))}
							</div>
						</div>
					)}
					
					{enumValues && (
						<div className="szdcInsar19-legend-section">
							<span>{enumValues.attribute && enumValues.attribute.data.nameDisplay}</span>
							<div>
								{_.map(enumValues.style, (enumStyle, enumKey) => (
									<div key={enumKey} className="szdcInsar19-legend-class">
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
								{tracks.map((track, index) => {
									if (track) {
										return (
											<div key={index} className="szdcInsar19-legend-track">
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
							<span>{sizes.attribute && sizes.attribute.data.nameDisplay}</span>
							<div>
								{sizes.style.map((styleClass, index) => (
									<div key={index} className="szdcInsar19-legend-class">
										<div><div style={{transform: `scale(${styleClass.size/15})`}}>{this.renderCircle()}</div></div>
										<span>{formatInterval(styleClass.interval, styleClass.intervalBounds)}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{arrowData && (
						<div className="szdcInsar19-legend-section">
							<span>{arrowData.attribute && arrowData.attribute.data.nameDisplay}</span>
							<div>
								{arrowData.styleValues.map((value, index) => {
									let style = utils.mapStyle.getStyleObject(value, arrowData.styleDefinition);

									return (
										<div key={index} className="szdcInsar19-legend-item">
											<div>{this.renderCircleWithArrow(style)}</div>
											<span>{value[arrowData.attribute.key]}</span>
										</div>
									);
								})}
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
					{this.renderSymbol({...utils.mapStyle.DEFAULT_STYLE_OBJECT, ...defaultStyle, ...style})}
					<div>{interval[0]} to {interval[1]}</div>
				</div>
			);
		});
	}

	renderValues(values, defaultStyle) {
		return _.map(values, (style, value) => {
			return (
				<div className="szdcInsar19-legend-item" key={value}>
					{this.renderSymbol({...utils.mapStyle.DEFAULT_STYLE_OBJECT, ...defaultStyle, ...style})}
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
		const size = utils.mapStyle.DEFAULT_SIZE;
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
		const size = utils.mapStyle.DEFAULT_SIZE;
		const svgStyle = this.getSvgStyle(style);
		const outlineWidth = style && style.outlineWidth || 0;
		return (
			<svg width={size + 2*outlineWidth} height={size + 2*outlineWidth}>
				<circle cx={size/2 + outlineWidth} cy={size/2 + outlineWidth} r={size/2} style={svgStyle}/>
			</svg>
		);
	}

	renderSquare(style) {
		const size = utils.mapStyle.DEFAULT_SIZE * 0.9;
		const svgStyle = this.getSvgStyle(style);
		const outlineWidth = style && style.outlineWidth || 0;
		return (
			<svg width={size + 2*outlineWidth} height={size + 2*outlineWidth}>
				<rect width={size} height={size} style={svgStyle}/>
			</svg>
		);
	}

	renderDiamond(style) {
		const size = utils.mapStyle.DEFAULT_SIZE * 0.85;
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

	renderCircleWithArrow(style) {
		const circleSize = utils.mapStyle.DEFAULT_SIZE;
		const outlineWidth = style && style.outlineWidth || 1;
		const circleStyle = this.getSvgStyle(style);

		const direction = style.arrowDirection || 1;

		// hack to make arrow in map and legend similar
		const arrowLength = style.arrowLength/2;

		let rectX = direction > 0 ? (circleSize + 2*outlineWidth  + arrowLength) : 0;

		return (
			<svg width={circleSize + 2*outlineWidth + 2*arrowLength} height={circleSize + 2*outlineWidth}>
				<circle cx={circleSize/2 + outlineWidth  + arrowLength} cy={circleSize/2 + outlineWidth} r={circleSize/2} style={circleStyle}/>
				<rect x={rectX} y={circleSize/2} width={arrowLength} height={style.arrowWidth} style={{fill: style.arrowColor}}/>
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