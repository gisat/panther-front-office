import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import _ from 'lodash';

import {
	vectorLayerDefaultFeatureStyle as defaultStyle,
	vectorLayerHighlightedFeatureStyle as highlightedFeatureStyle
} from "../../constants";

import HoverContext from "../../../../common/HoverHandler/context";

class VectorLayer extends React.PureComponent {
	static contextType = HoverContext;

	// todo handle custom styles
	static propTypes = {
		data: PropTypes.object,
		group: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.layer = L.geoJSON(props.data.options.features, {
			style: this.getLayerStyle.bind(this),
			onEachFeature: this.onEachFeature.bind(this)
		});

		props.group.addLayer(this.layer);
	}

	componentDidMount() {
		if (this.context) {
			this.checkContext();
		}
	}

	componentDidUpdate() {
		if (this.context) {
			this.checkContext();
		}
	}

	// TODO quick solution for choropleths. Find out choropleths in general.
	getLayerStyle(feature) {
		const propStyle = this.props.data && this.props.data.options && this.props.data.options.style;
		let fillColor = defaultStyle.fillColor;
		if (propStyle && propStyle.fillColor) {
			if (typeof propStyle.fillColor === 'function') {
				fillColor = propStyle.fillColor(feature.properties[this.props.data.options.valueProperty]);
			} else {
				fillColor = propStyle.fillColor;
			}
		}

		return {
			opacity: (this.props.data && this.props.data.opacity) || 1,
			fillOpacity: (propStyle && propStyle.fillOpacity) || defaultStyle.fillOpacity,
			fillColor,
			weight: (propStyle && propStyle.strokeWidth) || defaultStyle.strokeWidth,
			color: (propStyle && propStyle.strokeColor) || defaultStyle.strokeColor
		};
	}

	checkContext() {
		let keyColumn = this.props.data.options.keyProperty;
		if (keyColumn) {
			let self = this;
			this.layer.eachLayer(function (feature) {
				let key = feature.feature.properties[keyColumn];
				let hovered = false;
				let selected = false;
				if (self.context.hoveredItems) {
					hovered = _.indexOf(self.context.hoveredItems, key) !== -1;
				}
				if (self.context.selectedItems) {
					selected = _.indexOf(self.context.selectedItems, key) !== -1;
				}
				if (hovered || selected) {
					self.highlightFeature(feature);
				} else {
					self.layer.resetStyle(feature);
				}
			});
		}
	}

	highlightFeature(feature) {
		feature.setStyle({
			color: highlightedFeatureStyle.strokeColor || feature.options.color,
			fillOpacity: highlightedFeatureStyle.fillOpacity  || feature.options.fillOpacity,
			fillColor: highlightedFeatureStyle.fillColor || feature.options.fillColor,
			weight: highlightedFeatureStyle.strokeWidth || feature.options.weight
		});
	}

	onEachFeature(feature, layer) {
		layer.on({
			mousemove: (e) => {
				if (this.context && this.context.onHover) {
					this.highlightFeature(e.target);

					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
						layer.bringToFront();
					}

					let keyColumn = this.props.data.options.keyProperty;
					let nameColumn = this.props.data.options.nameProperty;
					if (keyColumn) {
						this.context.onHover([e.target.feature.properties[keyColumn]], {
							popup: {
								x: e.originalEvent.pageX,
								y: e.originalEvent.pageY,
								content: <div className="ptr-popup-header">{e.target.feature.properties[nameColumn] || "Area"}</div>
							}
						});
					}
				}
			},
			mouseout: (e) => {
				if (this.context && this.context.onHoverOut) {
					this.checkContext();
					this.context.onHoverOut();
				} else {
					this.layer.resetStyle(e.target);
				}
			},
			click: (e) => {
				if (this.context && this.context.onClick) {
					this.highlightFeature(e.target);

					if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
						layer.bringToFront();
					}

					let keyColumn = this.props.data.options.keyProperty;
					if (keyColumn) {
						this.context.onClick([e.target.feature.properties[keyColumn]]);
					}
				}
			}
		});
	}

	render() {
		return null;
	}
}

export default VectorLayer;
