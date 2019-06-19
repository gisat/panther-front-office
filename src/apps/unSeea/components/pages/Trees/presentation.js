import React from 'react';
import PropTypes from 'prop-types';

import App from '../../App'

class Apps extends React.PureComponent {
	static propTypes = {};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onMount()
	}
	render() {
		return (
			<App/>
		);
	}
}

export default Apps;