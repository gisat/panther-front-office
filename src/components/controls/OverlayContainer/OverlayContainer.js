import React from 'react';
import PropTypes from 'prop-types';
import Overlay from "./components/Overlay";
import utils from "../../../utils/utils";

class OverlayContainer extends React.PureComponent {
	constructor(props) {
		super();
	}

	render() {
		if (this.props.scope && this.props.scope.viewSelection === 'aoiPeriodsSelector') {
			return React.createElement(Overlay, this.props);

		} else {

			return null;

		}
	}


}

export default OverlayContainer;
