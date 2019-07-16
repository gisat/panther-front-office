import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import React from "react";

const mapStateToProps = (state, ownProps) => {
	return {
		backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.mapKey),
		layers: Select.maps.getLayers(state, ownProps.mapKey),
		view: Select.maps.getView(state, ownProps.mapKey)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.maps.use(ownProps.mapKey));
		},

		onUnmount: () => {
			dispatch(Action.maps.useClear(ownProps.mapKey));
		},

		onViewChange: (update) => {
			dispatch(Action.maps.updateMapAndSetView(ownProps.mapKey, update));
			// dispatch(Action.maps.setActiveMapKey(ownProps.mapKey));
		},

		onClick: () => {
			dispatch(Action.maps.setActiveMapKey(ownProps.mapKey));
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
		const {children, ...propsWithoutChildren} = this.props;
		return React.cloneElement(React.Children.only(children), propsWithoutChildren);
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);
