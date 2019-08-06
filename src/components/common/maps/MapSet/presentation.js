import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import mapUtils from '../../../../utils/map';

import ContainerMap from '../Map';
import {defaultMapView} from '../constants';

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
		activeMapKey: PropTypes.string,
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		mapComponent: PropTypes.func,
		sync: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.state = {
			view: props.view,
			activeMapKey: props.activeMapKey
		};

		_.forEach(this.props.children, child => {
			if (typeof child === "object"
				&& (child.type === Map || child.type === ContainerMap || child.type === PresentationMap)
				&& child.props.mapKey === props.activeMapKey) {
				this.state.activeMapView = {...defaultMapView, ...props.view, ...child.props.view}
			}
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.view !== this.props.view) {
			this.setState({
				view: {...this.state.view, ...this.props.view}
			});
		}
	}

	onViewChange(mapKey, update) {
		let syncUpdate;
		let activeUpdate;

		if (this.props.sync) {
			syncUpdate = _.pickBy(update, (updateVal, updateKey) => {
				return this.props.sync[updateKey];
			});
			syncUpdate = mapUtils.checkViewIntegrity(syncUpdate);
		}

		if ((mapKey && this.state.activeMapKey === mapKey) || (this.state.activeMapKey && !mapKey)) {
			activeUpdate = mapUtils.mergeViews(this.state.activeMapView, update);
		}

		if (syncUpdate && !_.isEmpty(syncUpdate)) {
			this.setState({
				view: mapUtils.mergeViews(this.state.view, syncUpdate),
				activeMapView: activeUpdate || mapUtils.mergeViews(this.state.activeMapView, syncUpdate)
			});
		} else if (activeUpdate) {
			this.setState({
				activeMapView: activeUpdate
			});
		}
	}

	onMapClick(key, view) {
		this.setState({activeMapView: view, activeMapKey: key});
	}

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
				console.log("******aa", this.state.activeMapView);
				return React.cloneElement(child, {
					...child.props,
					view: this.state.activeMapView,
					updateView: this.onViewChange.bind(this, null),
					resetHeading: () => {} //TODO
				});
			}
		});
	}

	renderMaps() {
		let maps = [];

		// For now, render either maps from state, OR from children

		if (this.props.maps && this.props.maps.length) {
			// all from state
			this.props.maps.map(mapKey => {
				let props = {
					key: mapKey,
					stateMapKey: mapKey
				};
				maps.push(React.createElement(ContainerMap, {...props, mapComponent: this.props.mapComponent}));
			});
		} else {
			React.Children.map(this.props.children, child => {
				let {view, layers, backgroundLayer, mapKey, ...restProps} = child.props;
				let props = {
					view: mapUtils.mergeViews(this.state.view, view),
					backgroundLayer: backgroundLayer || this.props.backgroundLayer,
					layers: mapUtils.mergeLayers(this.props.layers, layers),
					onViewChange: this.onViewChange.bind(this, mapKey),
					onClick: this.onMapClick.bind(this, mapKey),
					mapKey
				};

				if (mapKey === this.state.activeMapKey) {
					props.view = this.state.activeMapView;
				}

				if (typeof child === "object" && (child.type === Map || child.type === ContainerMap)) {
					// layers from state
					maps.push(React.createElement(ContainerMap, {...props, mapComponent: this.props.mapComponent}));
				} else if (typeof child === "object" && child.type === PresentationMap) {
					// all presentational
					maps.push(React.createElement(this.props.mapComponent, props));
				}
			});
		}

		return (<MapGrid>{maps}</MapGrid>);
	}
}

export default MapSet;
