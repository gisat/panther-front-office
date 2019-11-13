import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import React from "react";
import _ from "lodash";
import {defaultMapView} from "../../../constants/Map";
import mapUtils from "../../../utils/map";

import './style.scss';

const mapStateToProps = (state, ownProps) => {
	if (ownProps.stateMapKey) {
		return {
			backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.stateMapKey),
			layers: Select.maps.getLayers(state, ownProps.stateMapKey),
			view: Select.maps.getView(state, ownProps.stateMapKey),
			mapKey: ownProps.stateMapKey
		}
	} else {
		return {
			// backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.backgroundLayer),
			// layers: Select.maps.getLayers(state, ownProps.layers)
		}
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	if (ownProps.stateMapKey) {
		return {
			onMount: () => {
				dispatch(Action.maps.use(ownProps.stateMapKey));
			},

			onUnmount: () => {
				dispatch(Action.maps.useClear(ownProps.stateMapKey));
			},

			onViewChange: (update) => {
				dispatch(Action.maps.updateMapAndSetView(ownProps.stateMapKey, update));
				// dispatch(Action.maps.setActiveMapKey(ownProps.mapKey));
			},

			resetHeading: () => {
				// todo
			},

			onClick: (view) => {
				// TODO set local active map key in set, if applicable
				dispatch(Action.maps.setMapSetActiveMapKey(ownProps.stateMapKey));
			}
		}
	} else {
		return {
			onMount: () => {
				// TODO implement action
				// dispatch(Action.maps.usePresentational(ownProps));
			},

			onUnmount: () => {
				// TODO implement action
				// dispatch(Action.maps.usePresentationalClear(ownProps));
			},

			onViewChange: ownProps.onViewChange || ((update) => {}),

			onClick: ownProps.onClick || ((view) => {})
		}
	}
};

class ConnectedMap extends React.PureComponent {

	constructor(props) {
		super(props);
		
		if (!props.stateMapKey) {
			this.state = {
				view: {...defaultMapView, ...props.view}
			};
		}
		
		this.onViewChange = this.onViewChange.bind(this);
		this.resetHeading = this.resetHeading.bind(this);
	}
	
	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}
	
	componentDidUpdate(prevProps) {
		const props = this.props;
		if (props.view) {
			if (prevProps && prevProps.view) { //todo simplify
				if (!_.isEqual(props.view, prevProps.view)) {
					this.setState({
						view: {...defaultMapView, ...props.view}
					});
				}
			} else {
				this.setState({
					view: {...defaultMapView, ...props.view}
				});
			}
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}
	
	onViewChange(update) {
		let view = {...this.state.view, ...update};
		view = mapUtils.ensureViewIntegrity(view);
		
		if (!_.isEqual(view, this.state.view)) {
			this.setState({view});
		}
	}
	
	resetHeading() {
		mapUtils.resetHeading(this.state.view.heading, (heading) => this.setState({
			view: {...this.state.view, heading}
		}));
	}

	render() {
		const {children, mapComponent, ...props} = this.props;
		if (!props.stateMapKey) {
			props.view = this.state.view || props.view;
			props.onViewChange = this.onViewChange;
		}
		let map = React.createElement(mapComponent, props, children); //todo ptr-map-wrapper ?
		if (!children) {
			return map;
		} else {
			return (
				<div className="ptr-map-controls-wrapper">
					{map}
					{React.Children.map(children, child => {
						return React.cloneElement(child, {
							...child.props,
							view: this.props.stateMapKey ? this.props.view : (this.state.view || this.props.view),
							updateView: this.props.stateMapKey ? this.props.onViewChange : this.onViewChange,
							resetHeading: this.props.stateMapKey ? this.props.resetHeading : this.resetHeading
						});
					})}
				</div>
			);
		}
	}
}

export const PresentationMap = ConnectedMap;
export default connect(mapStateToProps, mapDispatchToProps)(ConnectedMap);
