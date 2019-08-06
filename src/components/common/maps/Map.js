import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import React from "react";

const mapStateToProps = (state, ownProps) => {
	if (ownProps.stateMapKey) {
		return {
			backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.stateMapKey),
			layers: Select.maps.getLayers(state, ownProps.stateMapKey),
			view: Select.maps.getView(state, ownProps.stateMapKey)
		}
	} else {
		return {
			// TODO implement selectors
			backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.backgroundLayer),
			layers: Select.maps.getLayers(state, ownProps.layers)
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

			onClick: (view) => {
				dispatch(Action.maps.setActiveMapKey(ownProps.stateMapKey));
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

class MapWrapper extends React.PureComponent {

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

	render() {
		const {children, mapComponent, ...props} = this.props;
		return React.createElement(mapComponent, props, children);
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);
