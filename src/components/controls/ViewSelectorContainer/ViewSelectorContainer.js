import React from 'react';
import PropTypes from 'prop-types';
import ViewSelector from "./components/ViewSelector";
import utils from "../../../utils/utils";

class ViewSelectorContainer extends React.PureComponent {
	constructor(props) {
		super();
	}

	render() {
		if (this.props.scope && this.props.scope.viewSelection) {
			return React.createElement(ViewSelector, this.props);

		} else {

			return null;

		}
	}


}

export default ViewSelectorContainer;
