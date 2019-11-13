import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import React from "react";
import _ from "lodash";
import {defaultMapView} from "../../../constants/Map";
import mapUtils from "../../../utils/map";

import './style.scss';
import utils from "../../../utils/utils";

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

const mapDispatchToPropsFactory = () => {
	const componentId = 'Map_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		if (ownProps.stateMapKey) {
			return {
				onMount: () => {
					dispatch(Action.maps.use(ownProps.stateMapKey));
				},

				onUnmount: () => {
					dispatch(Action.maps.useClear(ownProps.stateMapKey));
				},

				refreshUse: () => {
					dispatch(Action.maps.use(ownProps.stateMapKey));
				},

				onViewChange: (update) => {
					dispatch(Action.maps.updateMapAndSetView(ownProps.stateMapKey, update));
				},

				resetHeading: () => {
					// todo
				},

				onClick: (view) => {
					dispatch(Action.maps.setMapSetActiveMapKey(ownProps.stateMapKey));
				}
			}
		} else {
			let mapKey = ownProps.mapKey || componentId;

			return {
				onMount: () => {
					dispatch(Action.maps.use(mapKey, ownProps.backgroundLayer, ownProps.layers));
				},

				onUnmount: () => {
					dispatch(Action.maps.useClear(mapKey));
				},

				refreshUse: () => {
					dispatch(Action.maps.use(mapKey, ownProps.backgroundLayer, ownProps.layers));
				},

				onViewChange: ownProps.onViewChange || ((update) => {}),

				onClick: ownProps.onClick || ((view) => {})
			}
		}
	}
};

class Map extends React.PureComponent {

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

		if (
			(props.layers && props.layers !== prevProps.layers)
			|| (props.backgroundLayer && props.backgroundLayer !== prevProps.backgroundLayer)
		) {
			this.props.refreshUse();
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

export const PresentationMap = Map;
export default connect(mapStateToProps, mapDispatchToPropsFactory)(Map);
