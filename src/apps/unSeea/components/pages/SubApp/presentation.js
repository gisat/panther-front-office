import React from 'react';

import App from '../../App'

class SubApp extends React.PureComponent {
	componentDidMount() {
		this.props.onMount()
	}
	render() {
		return (
			<App {...this.props}/>
		);
	}
}

export default SubApp;