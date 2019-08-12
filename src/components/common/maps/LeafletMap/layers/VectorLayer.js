import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import _ from 'lodash';

import {
	vectorLayerDefaultFeatureStyle as featureStyle,
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
			style: {
				opacity: props.data.opacity || 1,
				fillOpacity: featureStyle.fillOpacity,
				weight: featureStyle.strokeWidth,
				color: featureStyle.strokeColor
			},
			onEachFeature: this.onEachFeature.bind(this)
		});

		props.group.addLayer(this.layer);
	}

	componentDidMount() {
		this.checkContext();
	}

	componentDidUpdate() {
		this.checkContext();
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
			color: highlightedFeatureStyle.strokeColor,
			fillOpacity: highlightedFeatureStyle.fillOpacity,
			fillColor: highlightedFeatureStyle.fillColor,
			weight: highlightedFeatureStyle.strokeWidth
		});
	}

	onEachFeature(feature, layer) {
		layer.on({
			mousemove: (e) => {
				this.highlightFeature(e.target);

				if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
					layer.bringToFront();
				}

				if (this.context && this.context.onHover) {
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
				this.layer.resetStyle(e.target);
				if (this.context && this.context.onHoverOut) {
					this.context.onHoverOut();
				}
			}
		});
	}

	render() {
		return null;
	}
}

export default VectorLayer;
