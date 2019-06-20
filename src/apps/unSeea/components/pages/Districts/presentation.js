import React from 'react';

import App from '../../App'

class Apps extends React.PureComponent {
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