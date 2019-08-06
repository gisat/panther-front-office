import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import ContainerMap from '../Map';

import './style.scss';
import MapGrid from "../MapGrid";

export class Map extends React.PureComponent {
	render() {
		return null;
	}
}

export class PresentationMap extends React.PureComponent {
	render() {
		return null;
	}
}

class MapSet extends React.PureComponent {

	static propTypes = {
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		mapComponent: PropTypes.func
	};

	render() {
		return (
			<div className="ptr-map-set">
				<div className="ptr-map-set-maps">
					{this.renderMaps()}
				</div>
				<div className="ptr-map-set-controls">
					{this.renderControls()}
				</div>
			</div>
		);
	}

	renderControls() {
		return React.Children.map(this.props.children, child => {
			if (!(typeof child === "object" && child.type === Map)) {
				return React.cloneElement(child);
			}
		});
	}

	renderMaps() {
		let maps = [];

		// For now, render either maps from state, OR from children
		if (this.props.maps && this.props.maps.length) {
			this.props.maps.map(mapKey => {
				let props = {
					key: mapKey,
					mapKey: mapKey
				};
				maps.push(React.createElement(ContainerMap, {...props, mapComponent: this.props.mapComponent}));
			});
		} else {
			React.Children.map(this.props.children, child => {
				if (typeof child === "object" && child.type === Map) {
					maps.push(React.createElement(ContainerMap, {...child.props, mapComponent: this.props.mapComponent}));
				} else if (typeof child === "object" && child.type === PresentationMap) {
					maps.push(React.createElement(this.props.mapComponent, child.props));
				}
			});
		}

		return (<MapGrid>{maps}</MapGrid>);
	}
}

export default MapSet;
