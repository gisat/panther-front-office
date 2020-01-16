import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";

class SzifMapView extends React.PureComponent {
	static propTypes = {
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="szifLpisZmenovaRizeni-map-view">
				<Button onClick={this.props.switchScreen}>Zpět</Button>
				{this.props.case && this.props.case.data.caseKey}
			</div>
		);
	}
}

export default SzifMapView;
