import React from 'react';
import PropTypes from "prop-types";

class Biofyzika extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<div>Biofyzika aaa</div>
		);
	}
}

export default Biofyzika;