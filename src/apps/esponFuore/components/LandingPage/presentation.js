import React from 'react';
import PropTypes from 'prop-types';

class LandingPage extends React.PureComponent {

	static propTypes = {
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		scopes: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		return (
			<div>
				{this.props.scopes ? this.props.scopes.map(scope => <div>{scope.data.nameDisplay}</div>) : null}
			</div>
		);
	}

}

export default LandingPage;

