import React from 'react';
import WorldWindMap from './WorldWindMap/presentation';
import PropTypes from "prop-types";

class MapWrapper extends React.PureComponent {

	static propTypes = {
		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	};

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
		return (
			<WorldWindMap
				{...this.props}
			/>
		);

	}
}

export default MapWrapper;
