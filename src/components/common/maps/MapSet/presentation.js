import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import mapUtils from '../../../../utils/map';

import ContainerMap from '../Map';
import {defaultMapView} from '../../../../constants/Map';

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
		activeMapView: PropTypes.object,
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		mapComponent: PropTypes.func,
		view: PropTypes.object,
		stateMapSetKey: PropTypes.string,
		sync: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.state = {
			view: props.view,
			activeMapKey: props.activeMapKey
		};

		_.forEach(this.props.children, child => {
			if (child && typeof child === "object"
				&& (child.type === Map || child.type === ContainerMap || child.type === PresentationMap)
				&& child.props.mapKey === props.activeMapKey) {
				this.state.activeMapView = {...defaultMapView, ...props.view, ...child.props.view}
			}
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!this.props.stateMapSetKey && (prevProps.view !== this.props.view)) {
			this.setState({
				view: {...this.state.view, ...this.props.view},
				activeMapView: {...this.state.activeMapView, ...this.props.view}
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
			syncUpdate = mapUtils.ensureViewIntegrity(syncUpdate);
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

	/**
	 * Called in uncontrolled map set
	 * @param key
	 * @param view
	 */
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
		let updateView, resetHeading, view;
		if (this.props.stateMapSetKey) {
			updateView = this.props.updateView;
			resetHeading = this.props.resetHeading;
			view = this.props.activeMapView;
		} else {
			updateView = this.onViewChange.bind(this, null);
			resetHeading = () => {}; //TODO
			view = this.state.activeMapView;
		}


		return React.Children.map(this.props.children, (child) => {
			if (!(typeof child === "object" && child.type === Map)) {
				return React.cloneElement(child, {
					...child.props,
					view,
					updateView,
					resetHeading
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
			React.Children.map(this.props.children, (child,index) => {
				let {view, layers, backgroundLayer, mapKey, ...restProps} = child.props;
				let props = {
					...restProps,
					key: index,
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
					maps.push([React.createElement(this.props.mapComponent, props), child.props.children]);
				}
			});
		}

		return (<MapGrid>{maps}</MapGrid>);
	}
}

export default MapSet;
