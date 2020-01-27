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
		customMapWrapper: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
		]),
		mapSetKey: PropTypes.string,
		maps: PropTypes.array,
		mapComponent: PropTypes.func,
		onMapClick: PropTypes.func,
		onViewChange: PropTypes.func,
		view: PropTypes.object,
		stateMapSetKey: PropTypes.string,
		sync: PropTypes.object
	};

	constructor(props) {
		super(props);

		if (!props.stateMapSetKey) {
			this.state = {
				view: mapUtils.mergeViews(defaultMapView, props.view),

				activeMapKey: props.activeMapKey,
				mapViews: {}
			};

			_.forEach(this.props.children, child => {
				if (child && typeof child === "object"
					&& (child.type === Map || child.type === ContainerMap || child.type === PresentationMap)
					&& child.props.mapKey === props.activeMapKey) {
					this.state.mapViews[child.mapKey] = mapUtils.mergeViews(defaultMapView, props.view, child.props.view);
				}
			});
		}
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const props = this.props;
		if (props.activeMapKey !== prevProps.activeMapKey) {
			this.setState({activeMapKey: props.activeMapKey});
		}

		if (!props.stateMapSetKey) {
			if (prevProps.view !== props.view) {
				let mapViews = _.mapValues(this.state.mapViews, view => {
					return {...view, ...props.view};
				});

				this.setState({
					// TODO sync props to view only?
					view: {...this.state.view, ...props.view},
					mapViews
				});
			}

			if (
				(props.layers && props.layers !== prevProps.layers)
				|| (props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer)
			) {
				if (props.refreshUse) {
					// props.refreshUse();
				}
			}
		}
	}

	onViewChange(mapKey, update) {
		let syncUpdate;
		update = mapUtils.ensureViewIntegrity(update);
		mapKey = mapKey || this.state.activeMapKey;

		if (this.props.sync) {
			syncUpdate = _.pickBy(update, (updateVal, updateKey) => {
				return this.props.sync[updateKey];
			});
			syncUpdate = mapUtils.ensureViewIntegrity(syncUpdate);
		}

		// merge views of all maps
		let mapViews = _.mapValues(this.state.mapViews, view => {
			return mapUtils.mergeViews(view, syncUpdate);
		});

		// merge views of given map
		mapViews[mapKey] = mapUtils.mergeViews(this.state.mapViews[mapKey], update);

		if (syncUpdate && !_.isEmpty(syncUpdate)) {
			const mergedView = mapUtils.mergeViews(this.state.view, syncUpdate);

			this.setState({
				view: mergedView,
				mapViews
			});

			if (this.props.onViewChange) {
				this.props.onViewChange(mergedView);
			}
		} else {
			this.setState({
				mapViews
			});
		}
	}

	/**
	 * Called in uncontrolled map set
	 * @param key
	 * @param view
	 */
	onMapClick(key, view) {
		const {onMapClick} = this.props;
		if (this.state.mapViews[key]) {
			this.setState({activeMapKey: key});
		} else {
			let mapViews = {...this.state.mapViews};
			mapViews[key] = view;

			this.setState({activeMapKey: key, mapViews});
		}

		if(typeof onMapClick === 'function') {
			onMapClick(key, view);
		}
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
			view = this.props.activeMapView || this.props.view;
		} else {
			updateView = this.onViewChange.bind(this, null);
			resetHeading = () => {}; //TODO
			view = mapUtils.mergeViews(this.state.view, this.state.mapViews[this.state.activeMapKey]);
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

		if (this.props.stateMapSetKey) {
			// all from state
			if (this.props.maps && this.props.maps.length) {
				this.props.maps.map(mapKey => {
					let props = {
						key: mapKey,
						stateMapKey: mapKey
					};

					// TODO
					// if (mapKey === this.state.activeMapKey) {
					// 	props.wrapperClasses = "active";
					// }
					maps.push(React.createElement(ContainerMap, {...props, mapComponent: this.props.mapComponent}));
				});
			}
		} else {
			React.Children.map(this.props.children, (child,index) => {
				let {view, layers, backgroundLayer, label, mapKey, ...restProps} = child.props;
				let props = {
					...restProps,
					label,
					key: index,
					view: mapUtils.mergeViews(this.state.view, view, this.state.mapViews[mapKey]),
					backgroundLayer: backgroundLayer || this.props.backgroundLayer,
					layers: mapUtils.mergeLayers(this.props.layers, layers),
					onViewChange: this.onViewChange.bind(this, mapKey),
					onClick: this.onMapClick.bind(this, mapKey),
					mapKey
				};

				if (mapKey === this.state.activeMapKey) {
					props.wrapperClasses = "active";
				}

				if (typeof child === "object" && (child.type === Map || child.type === ContainerMap)) {
					// layers from state
					maps.push(React.createElement(ContainerMap, {...props, mapComponent: this.props.mapComponent}));
				} else if (typeof child === "object" && child.type === PresentationMap) {
					// all presentational
					maps.push(React.createElement(this.props.mapComponent, props, child.props.children));
				}
			});
		}

		return (<MapGrid customWrapper={this.props.customMapWrapper}>{maps}</MapGrid>);
	}
}

export default MapSet;
